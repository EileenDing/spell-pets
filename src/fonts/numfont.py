# Clear digits for prices and numbers: subsets VT323 (OFL) to 0-9 $ , . + - % / and writes numfont.css,
# which the build puts in front of Pixelify Sans so numbers use VT323 and letters stay Pixelify.
import base64, io, os
from fontTools import subset
from fontTools.ttLib import TTFont
here = os.path.dirname(os.path.abspath(__file__))
f = TTFont(os.path.join(here, 'vt323-latin-400-normal.woff2'))
opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = []
s = subset.Subsetter(opts); s.populate(text='0123456789$,.+-%/'); s.subset(f)
b = io.BytesIO(); f.flavor = 'woff2'; f.save(b)
uri = 'data:font/woff2;base64,' + base64.b64encode(b.getvalue()).decode()
css = ("@font-face{font-family:'SpellNum';src:url(%s) format('woff2');unicode-range:U+0024,U+002B-002F,U+0025,U+0030-0039;"
       "size-adjust:128%%;ascent-override:72%%;descent-override:22%%;font-display:block;}") % uri
open(os.path.join(here, '..', 'numfont.css'), 'w').write(css); print(len(css), 'bytes')
