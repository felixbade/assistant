import argparse
from xml.dom import minidom
from xml.etree.ElementTree import Element, SubElement, tostring

def generate_x_icon_svg(line_thickness, cross_length):
    canvas_size = (line_thickness + cross_length)

    xmlns = "http://www.w3.org/2000/svg"
    svg = Element('svg', {
        'xmlns': xmlns,
        'width': f'{canvas_size*2}',
        'height': f'{canvas_size*2}',
        'viewBox': f'-{line_thickness} -{line_thickness} {canvas_size + line_thickness} {canvas_size + line_thickness}'
    })

    path = SubElement(svg, 'path', {
        'stroke': 'var(--settings-icon-border)',
#        'stroke': 'black',
        'stroke-width': f'{line_thickness}',
        'fill': 'none',
        'd': f"M0,0 L{cross_length},{cross_length} M0,{cross_length} L{cross_length},0",
    })

    raw_svg = tostring(svg)
    pretty_svg = minidom.parseString(raw_svg).toprettyxml(indent="  ")
    return pretty_svg

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-t', '--thickness', type=float, required=True, help="Set the line thickness.")
    parser.add_argument('-c', '--cross_length', type=float, required=True, help="Set the length of the cross.")
    parser.add_argument('-o', '--output', type=str, default='x_icon.svg', help="Output SVG file name (default: x_icon.svg)")

    args = parser.parse_args()

    svg = generate_x_icon_svg(args.thickness, args.cross_length)

    with open(args.output, 'w') as f:
        f.write(svg)
