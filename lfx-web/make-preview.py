"""Bundle dist/ into one self-contained HTML file (JS, CSS and images inlined),
so the site opens by double-clicking, without a server."""
import base64, os, re

DIST = os.path.join(os.path.dirname(__file__), 'dist')
OUT = os.path.join(os.path.dirname(__file__), 'lfx-web-preview.html')
MIME = {'.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg'}


def data_uri(rel):
    path = os.path.join(DIST, rel)
    with open(path, 'rb') as f:
        return 'data:%s;base64,%s' % (MIME[os.path.splitext(rel)[1]], base64.b64encode(f.read()).decode())


def inline_assets(text):
    return re.sub(r'\./((?:3d|cursos|dentro|cascada|resultados)/[\w.-]+\.(?:webp|png|jpg))', lambda m: data_uri(m.group(1)), text)


html = open(os.path.join(DIST, 'index.html'), encoding='utf-8').read()

css_href = re.search(r'<link rel="stylesheet"[^>]*href="\./([^"]+)"[^>]*>', html)
css = open(os.path.join(DIST, css_href.group(1)), encoding='utf-8').read()
html = html.replace(css_href.group(0), '<style>' + css + '</style>')

js_tag = re.search(r'<script type="module"[^>]*src="\./([^"]+)"[^>]*></script>', html)
js = open(os.path.join(DIST, js_tag.group(1)), encoding='utf-8').read()
js = inline_assets(js).replace('</script', '<\\/script')
html = html.replace(js_tag.group(0), '')
html = html.replace('</body>', '<script type="module">' + js + '</script>\n</body>')
html = inline_assets(html)

open(OUT, 'w', encoding='utf-8').write(html)
print(OUT, os.path.getsize(OUT) // 1024, 'KB')
