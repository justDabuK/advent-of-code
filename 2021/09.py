import pprint

import numpy


def extract_data(file_name):
    data = []
    with open(file_name) as file:
        lines = file.readlines()

        for line in lines:
            data.append(list(map(lambda x: [int(x), False], list(line.rstrip()))))

    return data


def part_one(file_name):
    height_map = extract_data(file_name)

    # check for all entries, if they are the lowest around,
    mark_lowest(height_map)

    # sum up all lowest points plus 1 each
    lowest_height_sum = 0
    for row in height_map:
        for col in row:
            if col[1]:
                lowest_height_sum += int(col[0]) + 1

    print(f"lowest height sum {lowest_height_sum}")


def mark_lowest(height_map):
    for row_index in range(len(height_map)):
        for col_index in range(len(height_map[row_index])):
            candidate = height_map[row_index][col_index][0]
            is_lowest = True

            position_left = height_map[row_index - 1][col_index][0] if row_index > 0 else None
            if position_left is not None and position_left <= candidate:
                is_lowest = False

            position_top = height_map[row_index][col_index - 1][0] if col_index > 0 else None
            if position_top is not None and position_top <= candidate:
                is_lowest = False

            position_right = height_map[row_index + 1][col_index][0] if row_index < len(height_map) - 1 else None
            if position_right is not None and position_right <= candidate:
                is_lowest = False

            position_bottom = height_map[row_index][col_index + 1][0] if col_index < len(
                height_map[row_index]) - 1 else None
            if position_bottom is not None and position_bottom <= candidate:
                is_lowest = False

            # print(
            #    f"is [{row_index}][{col_index}]:{candidate} lowest, next to [{row_index - 1}][{col_index}]:{position_left}, [{row_index}][{col_index - 1}]:{position_top}, [{row_index + 1}][{col_index}]:{position_right}, [{row_index}][{col_index + 1}]:{position_bottom} -> {is_lowest}")
            if is_lowest:
                height_map[row_index][col_index][1] = True


def part_two(file_name):
    height_map = extract_data(file_name)

    mark_lowest(height_map)

    lowest_points = []

    for row_index in range(len(height_map)):
        for col_index in range(len(height_map[row_index])):
            height = height_map[row_index][col_index]
            if height[1]:
                lowest_points.append(
                    {"index": len(lowest_points), "height": height[0], "row index": row_index, "col index": col_index,
                     "counter": 0})

    basin_counter = 0
    for test_point in lowest_points:
        basin_counter += get_basin_count(height_map, test_point, "", test_point["index"])

    #print(f"basin count {basin_counter}")

    # get the points left and right from the given point

    #pprint.pprint(lowest_points)

    for row in height_map:
        string_to_print = ""
        for col in row:
            string_to_print += f"{col[0]}({col[1]}) "
            if col[1] is not False:
                lowest_points[col[1]]["counter"] += 1
        #print(string_to_print)
    pprint.pprint(lowest_points)
    # find the 4 largest
    counter_list = list(map(lambda x: x["counter"], lowest_points))
    #print(counter_list)
    result = numpy.argsort(counter_list)
    #print(result)
    basin_multiplier = 1
    for index in range(len(result) - 1, len(result) - 4, -1):
        basin_multiplier *= counter_list[result[index]]
    print(f"multiplied basins {basin_multiplier}")

def get_basin_count(height_map, test_point, ignore, basin_index):
    row_index = test_point["row index"]
    col_index = test_point["col index"]
    height_map[row_index][col_index][1] = basin_index

    point_counter = 1

    # top
    top_point = height_map[row_index - 1][col_index][0] if row_index > 0 else None
    top_group = height_map[row_index - 1][col_index][1] if row_index > 0 else None
    if top_point and top_point != 9 and ignore != "top" and not top_group:
        point_counter += get_basin_count(height_map, {"row index": row_index - 1, "col index": col_index}, "bottom",
                                         basin_index)

    # bottom
    bottom_point = height_map[row_index + 1][col_index][0] if row_index < len(height_map) - 1 else None
    bottom_group = height_map[row_index + 1][col_index][1] if row_index < len(height_map) - 1 else None
    if bottom_point and bottom_point != 9 and ignore != "bottom" and not bottom_group:
        point_counter += get_basin_count(height_map, {"row index": row_index + 1, "col index": col_index}, "top",
                                         basin_index)

    # left
    left_point = height_map[row_index][col_index - 1][0] if col_index > 0 else None
    left_group = height_map[row_index][col_index - 1][1] if col_index > 0 else None
    if left_point and left_point != 9 and ignore != "left" and not left_group:
        point_counter += get_basin_count(height_map, {"row index": row_index, "col index": col_index - 1}, "right",
                                         basin_index)

    # right
    right_point = height_map[row_index][col_index + 1][0] if col_index < len(height_map[0]) - 1 else None
    right_group = height_map[row_index][col_index + 1][1] if col_index < len(height_map[0]) - 1 else None
    if right_point and right_point != 9 and ignore != "right" and not right_group:
        point_counter += get_basin_count(height_map, {"row index": row_index, "col index": col_index + 1}, "left",
                                         basin_index)

    return point_counter


if __name__ == "__main__":
    part_two("09_input.txt")
