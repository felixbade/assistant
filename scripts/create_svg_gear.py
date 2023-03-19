# Partially written by ChatGPT
# Example:
# python create_svg_gear.py -w 5 -n 9 -i 35 -t 0.4 -b 0.2 -d 12


import svgwrite
import math
import argparse

def wavy_gear_svg(radius_outer, radius_inner, num_teeth, line_width, teeth_depth, teeth_width, base_width, file_name):
    canvas_size = 2 * (radius_outer + line_width)
    dwg = svgwrite.Drawing(file_name, profile='tiny', size=("100%", "100%"), viewBox=(f"0 0 {canvas_size} {canvas_size}"))

    angle_step = 2 * math.pi / num_teeth
    gear_path = svgwrite.path.Path(d='M', stroke='black', fill='white', fill_rule='evenodd', stroke_width=line_width)

    for i in range(num_teeth):
        angle = i * angle_step - math.pi/2
        angle_next = angle + angle_step

        gear_center = canvas_size / 2

        tooth_width = angle_step * teeth_width
        base_width2 = angle_step * base_width
        tip_angle = angle + angle_step / 2

        def push_angle(radius, a):
            x = radius * math.cos(a) + gear_center
            y = radius * math.sin(a) + gear_center
            gear_path.push(round(x, 3), round(y, 3))

        # Tooth Tip
        if i != 0:
            gear_path.push("L")
        push_angle(radius_outer, angle + tooth_width/2)

        # Tooth Base
        gear_path.push("L")
        push_angle(radius_outer - teeth_depth, tip_angle - base_width2 / 2)
        gear_path.push("L")
        push_angle(radius_outer - teeth_depth, tip_angle + base_width2 / 2)

        # Tooth Tip
        gear_path.push("L")
        push_angle(radius_outer, angle_next - tooth_width/2)


        # Close the path
        if i == num_teeth - 1:
            gear_path.push("Z")

    dwg.add(gear_path)
    dwg.add(dwg.circle(center=(gear_center, gear_center), r=radius_inner / 2, stroke='black', stroke_width=line_width, fill='white'))
    dwg.save()

def main():
    parser = argparse.ArgumentParser(description="Generate a wavy gear SVG icon with configurable parameters")
    parser.add_argument("-o", "--radius_outer", type=int, default=50, help="Outer radius of the gear")
    parser.add_argument("-i", "--radius_inner", type=int, default=32, help="Inner radius of the gear")
    parser.add_argument("-n", "--num_teeth", type=int, default=20, help="Number of teeth in the gear")
    parser.add_argument("-w", "--line_width", type=float, default=0.5, help="Line width for the gear")
    parser.add_argument("-d", "--teeth_depth", type=float, default=10, help="Depth of the teeth in the gear")
    parser.add_argument("-t", "--teeth_width", type=float, default=0.4, help="Width of the teeth tip in the gear, as a proportion of the space between teeth")
    parser.add_argument("-b", "--base_width", type=float, default=0.4, help="Width of the teeth base in the gear, as a proportion of the space between teeth")
    parser.add_argument("-f", "--file_name", type=str, default="settings_gear_icon.svg", help="Output file name for the SVG icon")

    args = parser.parse_args()

    wavy_gear_svg(radius_outer=args.radius_outer, radius_inner=args.radius_inner, num_teeth=args.num_teeth, line_width=args.line_width, teeth_depth=args.teeth_depth, teeth_width=args.teeth_width, base_width=args.base_width, file_name=args.file_name)

if __name__ == "__main__":
    main()
