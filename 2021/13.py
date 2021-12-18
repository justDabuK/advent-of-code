import pprint
import re


def extract_data(file_name):
    dot_positions = []
    fold_instructions = []
    with open(file_name) as file:
        lines = file.readlines()

        for line in lines:
            if "," in line:
                splitted_line = line.split(",")
                dot_positions.append([int(splitted_line[1]), int(splitted_line[0])])
            elif "fold" in line:
                result = re.search("fold along (.+)=([0-9][0-9][0-9]|[0-9][0-9]|\d)", line)
                fold_instructions.append([result.group(1), int(result.group(2))])

    return dot_positions, fold_instructions


def get_dot_count(transparent_paper):
    dot_counter = 0
    for row_index in range(len(transparent_paper)):
        for col_index in range(len(transparent_paper[row_index])):
            if transparent_paper[row_index][col_index] == "#":
                dot_counter += 1
    return dot_counter


def mark_dots_in_matrix(dot_positions, transparent_paper):
    for position in dot_positions:
        transparent_paper[position[X]][position[Y]] = "#"


def create_blank_matrix_from_positions(dot_positions):
    max_x = max(list(map(lambda x: x[0], dot_positions)))
    max_y = max(list(map(lambda x: x[1], dot_positions)))
    transparent_paper = []
    for row in range(max_x + 1):
        dot_row = []
        for col in range(max_y + 1):
            dot_row.append('.')
        transparent_paper.append(dot_row)
    return transparent_paper


def do_fold(dot_positions, fold_instruction):
    fold_axis = fold_instruction[0]
    fold_value = fold_instruction[1]
    for position in dot_positions:
        if fold_axis == "y":
            if position[X] > fold_value:
                position[X] = fold_value - (position[X] - fold_value)
        elif fold_axis == "x":
            if position[Y] > fold_value:
                position[Y] = fold_value - (position[Y] - fold_value)
        else:
            print(f"no instructions found for fold axis {fold_axis}")


X = 0
Y = 1


def part_one(file_name):
    dot_positions, fold_instructions = extract_data(file_name)

    # when we fold via y, all y-values stay the same, only the x-values of the points whoes x is higher then the foldvalue change
    # with a fold y=7
    # an former 8,1 also written as (7+1),1 would afterwards be a 6,1 which could be written like (7-1),1
    # therefore the formula should be new_x = fold_value - (old_x - fold_value)
    transparent_paper = create_blank_matrix_from_positions(dot_positions)
    mark_dots_in_matrix(dot_positions, transparent_paper)

    dot_counter = get_dot_count(transparent_paper)
    print(f"there are {dot_counter} remaining dots")

    fold_instruction = fold_instructions[0]
    do_fold(dot_positions, fold_instruction)
    transparent_paper = create_blank_matrix_from_positions(dot_positions)
    mark_dots_in_matrix(dot_positions, transparent_paper)
    dot_counter = get_dot_count(transparent_paper)
    print(f"there are {dot_counter} remaining dots")


def part_two(file_name):
    dot_positions, fold_instructions = extract_data(file_name)

    for fold_instruction in fold_instructions:
        do_fold(dot_positions, fold_instruction)
    transparent_paper = create_blank_matrix_from_positions(dot_positions)
    mark_dots_in_matrix(dot_positions, transparent_paper)
    for row in transparent_paper:
        print(row)


if __name__ == "__main__":
    part_two("13_input.txt")
