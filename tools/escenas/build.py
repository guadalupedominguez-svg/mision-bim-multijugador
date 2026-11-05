"""Genera las piezas animadas de cada escena.

Para cada escena produce:
  public/assets/anim/<escena>-plate.webp   fondo sin las piezas móviles (relleno por inpainting)
  public/assets/anim/<escena>-<pieza>.webp  cada pieza recortada con transparencia
  public/scene-anim.js                       descripción de piezas y movimientos para el juego

Uso: python3 tools/escenas/build.py [escena ...]
Requiere: opencv-python (con contrib para xphoto), numpy, Pillow.
"""
import json, sys, os
import numpy as np, cv2
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from spec import SCENES

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
ASSETS = os.path.join(ROOT, 'public', 'assets')
OUT = os.path.join(ASSETS, 'anim')

def poly_mask(shape, pts):
    m = np.zeros(shape[:2], np.uint8)
    cv2.fillPoly(m, [np.round(np.array(pts, np.float64)).astype(np.int32)], 255)
    return m

def mask_sky(img, pmask, thr):
    """Píxeles de la pieza que se distinguen del cielo que la rodea."""
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    hole = cv2.dilate(pmask, k)
    est = cv2.inpaint(img, hole, 9, cv2.INPAINT_TELEA)
    est = cv2.GaussianBlur(est, (0, 0), 2.5)
    diff = np.abs(img.astype(np.int16) - est.astype(np.int16)).max(axis=2)
    m = (diff > thr).astype(np.uint8) * 255
    m = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    m &= pmask
    # quitar motas sueltas
    n, lab, stats, _ = cv2.connectedComponentsWithStats(m, 8)
    for i in range(1, n):
        if stats[i, cv2.CC_STAT_AREA] < 12:
            m[lab == i] = 0
    return m

def mask_object(img, pmask, core=None):
    """Objeto sobre fondo con textura: GrabCut iniciado con el polígono."""
    x, y, w, h = cv2.boundingRect(pmask)
    pad = 12
    x0, y0 = max(0, x - pad), max(0, y - pad)
    x1, y1 = min(img.shape[1], x + w + pad), min(img.shape[0], y + h + pad)
    roi = img[y0:y1, x0:x1].copy()
    pm = pmask[y0:y1, x0:x1]
    gc = np.where(pm > 0, cv2.GC_PR_FGD, cv2.GC_BGD).astype(np.uint8)
    if core is None:
        # núcleo por defecto: el polígono reducido, para que GrabCut nunca descarte toda la pieza
        k = max(3, int(min(w, h) * 0.22)) | 1
        core = cv2.erode(pmask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
    gc[core[y0:y1, x0:x1] > 0] = cv2.GC_FGD
    bg, fg = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(roi, gc, None, bg, fg, 6, cv2.GC_INIT_WITH_MASK)
    sub = np.where((gc == cv2.GC_FGD) | (gc == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
    sub = cv2.morphologyEx(sub, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)))
    sub = cv2.morphologyEx(sub, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    # conservar solo la componente más grande (y las que tocan el núcleo)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(sub, 8)
    if n > 1:
        keep = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        sub = np.where(lab == keep, 255, 0).astype(np.uint8)
    m = np.zeros(pmask.shape, np.uint8)
    m[y0:y1, x0:x1] = sub
    return m & pmask

def build(name):
    spec = SCENES[name]
    src = os.path.join(ASSETS, f'{name}.png')
    img = cv2.imread(src, cv2.IMREAD_COLOR)
    H, W = img.shape[:2]
    pieces, union = [], np.zeros((H, W), np.uint8)
    for el in spec['pieces']:
        pm = poly_mask(img.shape, el['poly'])
        for extra in el.get('polys', []):
            pm |= poly_mask(img.shape, extra)
        method = el.get('mask', 'sky')
        if method == 'sky':
            m = mask_sky(img, pm, el.get('thr', 18))
        elif method == 'object':
            core = poly_mask(img.shape, el['core']) if el.get('core') else None
            m = mask_object(img, pm, core)
        else:
            m = pm.copy()
        for extra in el.get('add', []):
            m |= poly_mask(img.shape, extra)
        for cut in el.get('sub', []):
            m &= ~poly_mask(img.shape, cut)
        el['_mask'] = m
        if el['motion']['type'] != 'static':
            union |= m
        pieces.append(el)
    # fondo limpio: rellenar todo lo que se mueve (con margen)
    hole = cv2.dilate(union, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
    for f in spec.get('fill_extra', []):
        hole |= poly_mask(img.shape, f)
    algo = spec.get('inpaint', 'shift')
    if algo == 'shift':
        # relleno por parches (reconstruye nubes y texturas sin manchas)
        lab = cv2.cvtColor(img, cv2.COLOR_BGR2Lab)
        res = np.zeros_like(lab)
        cv2.xphoto.inpaint(lab, (hole == 0).astype(np.uint8), res, cv2.xphoto.INPAINT_SHIFTMAP)
        plate = cv2.cvtColor(res, cv2.COLOR_Lab2BGR)
        # suavizar costuras entre parches solo dentro del hueco
        soft = cv2.GaussianBlur(plate, (0, 0), 1.6)
        wgt = cv2.GaussianBlur((hole > 0).astype(np.float32), (0, 0), 2)[..., None]
        plate = (plate * (1 - wgt * .7) + soft * (wgt * .7)).astype(np.uint8)
    elif algo == 'fsr':
        m01 = (hole == 0).astype(np.uint8)
        plate = np.zeros_like(img)
        cv2.xphoto.inpaint(img, m01, plate, cv2.xphoto.INPAINT_FSR_FAST)
    elif algo == 'ns':
        plate = cv2.inpaint(img, hole, 7, cv2.INPAINT_NS)
    else:
        plate = cv2.inpaint(img, hole, 7, cv2.INPAINT_TELEA)
    # piezas que prefieren un relleno suave (cielo con degradado) en lugar de parches
    soft_sel = np.zeros((H, W), np.uint8)
    for el in pieces:
        if el.get('inpaint') == 'telea':
            soft_sel |= cv2.dilate(el['_mask'], cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
    if soft_sel.any():
        tel = cv2.inpaint(img, hole, 7, cv2.INPAINT_TELEA)
        plate = np.where((soft_sel > 0)[..., None] & (hole > 0)[..., None], tel, plate)
    # ruido fino para que el relleno no se vea liso
    noise = np.random.default_rng(7).normal(0, spec.get('grain', 1.6), img.shape).astype(np.float32)
    plate = np.where(hole[..., None] > 0, np.clip(plate.astype(np.float32) + noise, 0, 255), plate).astype(np.uint8)
    os.makedirs(OUT, exist_ok=True)
    dbg = os.environ.get('ANIM_DEBUG')
    if dbg:
        ov = img.copy()
        for el in pieces:
            col = (0, 0, 255) if el['motion']['type'] != 'static' else (0, 255, 0)
            ov[el['_mask'] > 0] = (ov[el['_mask'] > 0] * .45 + np.array(col) * .55).astype(np.uint8)
            for pp in [el['poly']] + el.get('polys', []) + el.get('add', []):
                cv2.polylines(ov, [np.round(np.array(pp, np.float64)).astype(np.int32)], True, (0, 255, 255), 1)
        cv2.imwrite(os.path.join(dbg, f'{name}-mask.jpg'), ov)
        cv2.imwrite(os.path.join(dbg, f'{name}-plate.jpg'), plate)
    Image.fromarray(cv2.cvtColor(plate, cv2.COLOR_BGR2RGB)).save(os.path.join(OUT, f'{name}-plate.webp'), quality=90, method=6)
    out = {'w': W, 'h': H, 'plate': f'assets/anim/{name}-plate.webp', 'pieces': []}
    for el in pieces:
        m = el['_mask']
        x, y, w, h = cv2.boundingRect(m)
        if w == 0:
            print('  ! pieza vacía', el['id']); continue
        x0, y0, x1, y1 = max(0, x - 7), max(0, y - 7), min(W, x + w + 7), min(H, y + h + 7)
        grow = m if el['motion']['type'] == 'static' else cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
        alpha = cv2.GaussianBlur(grow[y0:y1, x0:x1], (0, 0), el.get('feather', 0.8))
        rgba = np.dstack([cv2.cvtColor(img[y0:y1, x0:x1], cv2.COLOR_BGR2RGB), alpha])
        fn = f'{name}-{el["id"]}.webp'
        Image.fromarray(rgba, 'RGBA').save(os.path.join(OUT, fn), lossless=True, method=6)
        piece = {'id': el['id'], 'src': f'assets/anim/{fn}', 'x': x0, 'y': y0, 'w': x1 - x0, 'h': y1 - y0}
        piece.update(el['motion'])
        out['pieces'].append(piece)
        print(f'  {el["id"]:12s} {piece["w"]}x{piece["h"]} px  área {int((m>0).sum())}')
    return out

def main():
    names = sys.argv[1:] or list(SCENES)
    path = os.path.join(ROOT, 'public', 'scene-anim.js')
    data = {}
    if os.path.exists(path):
        txt = open(path, encoding='utf8').read()
        data = json.loads(txt[txt.index('{'):txt.rindex('}') + 1])
    for n in names:
        print(n)
        data[n] = build(n)
    with open(path, 'w', encoding='utf8') as f:
        f.write('// Generado por tools/escenas/build.py. No editar a mano: cambia tools/escenas/spec.py.\n')
        f.write('window.SCENE_ANIM = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')

if __name__ == '__main__':
    main()
