# this is definitely an optimization problem
# just don't know yet how that helps
# one requirement is that it lands after n-steps in the target area
# the other one is, that it is the one that has the highest y value
import re

X = 0
Y = 1
DEBUG = False


def extract_data(file_name):
    x_threshold_1 = None
    x_threshold_2 = None
    y_threshold_1 = None
    y_threshold_2 = None

    with open(file_name) as file:
        lines = file.readlines()

        for line in lines:
            result = re.search("target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)", line)

            first_x_value = result.group(1)
            second_x_value = result.group(2)
            first_y_value = result.group(3)
            second_y_value = result.group(4)

            x_threshold_1 = int(first_x_value)
            x_threshold_2 = int(second_x_value)
            y_threshold_1 = int(first_y_value)
            y_threshold_2 = int(second_y_value)

    return x_threshold_1, x_threshold_2, y_threshold_1, y_threshold_2


def part_one(file_name):
    x_threshold_1, x_threshold_2, y_threshold_1, y_threshold_2 = extract_data(file_name)

    print(f"field goes from x={x_threshold_1} to {x_threshold_2} and y = {y_threshold_1} to {y_threshold_2}")

    """
    how to create possible starting vectors, I think in terms of x one could say that depending on if the shuttle 
    is left or right from the target_area, the x windows is either
    - left: 0 - x_threshold_2
    - right: x_threshold_1 - 0
    
    with the y value I'd say minimal value is y_threshold 1 the maximum, I'm not quite sure but it feels like, if i 
    encountered 2 wrong vectors while increasing y, i can stop
    """
    max_y_value = 0
    for x_value in range(0, x_threshold_2 + 1):
        for y_value in range(y_threshold_1, 200):
            starting_vector = [x_value, y_value]
            string = f"{starting_vector}"
            velocity_vector = starting_vector

            is_valid, highest_y_value = is_valid_vector_with_y_value(velocity_vector, x_threshold_1, x_threshold_2,
                                                                     y_threshold_1, y_threshold_2)

            if is_valid:
                print(f"  is {string} a valid starting vector? {is_valid}. Had maximum y of {highest_y_value}")

            if is_valid and highest_y_value > max_y_value:
                max_y_value = highest_y_value

    print(f"maximum possible y is {max_y_value}")


def is_valid_vector_with_y_value(velocity_vector, x_threshold_1, x_threshold_2, y_threshold_1, y_threshold_2):
    position = [0, 0]
    go_further = True
    is_valid = False
    highest_y_value = 0
    starting_position_relative_to_target = [None, None]
    if position[X] < x_threshold_1:
        starting_position_relative_to_target[X] = "left"
    elif position[X] > x_threshold_2:
        starting_position_relative_to_target[X] = "right"
    else:
        if DEBUG:
            print("  starting position is neither left nor right from the target area")
    if position[Y] < y_threshold_1:
        starting_position_relative_to_target[Y] = "below"
    elif position[X] > y_threshold_2:
        starting_position_relative_to_target[Y] = "above"
    else:
        if DEBUG:
            print("  starting position is neither left nor right from the target area")
    if DEBUG:
        print(
            f"  in relation to the target area the starting position is {starting_position_relative_to_target[X]} {starting_position_relative_to_target[Y]}")
    max_iteration_count = 400
    curr_iteration = 0
    while go_further:

        # if curr_iteration > max_iteration_count:
        #     go_further = False
        #     is_valid = False
        #     if DEBUG:
        #         print("reached maximum tries")

        curr_iteration += 1

        # add velocity_vector to current position
        position[X] += velocity_vector[X]
        position[Y] += velocity_vector[Y]
        if DEBUG:
            print(f"  {curr_iteration}: current position {position}, last velocity {velocity_vector}")

        if position[Y] > highest_y_value:
            highest_y_value = position[Y]

        # check if position is in target area
        if x_threshold_1 <= position[X] <= x_threshold_2 and y_threshold_1 <= position[Y] <= y_threshold_2:
            go_further = False
            is_valid = True
            if DEBUG:
                print("OHHHH, i found something")

        # check if position has the possibility to reach the target
        if starting_position_relative_to_target[X] == "left" and position[X] > x_threshold_2:
            go_further = False
            is_valid = False
            if DEBUG:
                print(
                    f"  probe went to much to the right {position} not in {x_threshold_1}..{x_threshold_2} | {y_threshold_1}..{y_threshold_2}")

        if starting_position_relative_to_target[X] == "right" and position[X] < x_threshold_1:
            go_further = False
            is_valid = False
            if DEBUG:
                print(
                    f"  probe went to much to the left is {position} not in {x_threshold_1}..{x_threshold_2} | {y_threshold_1}..{y_threshold_2}")

        if starting_position_relative_to_target[Y] == "above" and position[Y] < y_threshold_1:
            go_further = False
            is_valid = False
            if DEBUG:
                print(
                    f"  probe is lost in the depth {position} not in {x_threshold_1}..{x_threshold_2} | {y_threshold_1}..{y_threshold_2}")

        # no check for below, not quite sure if this is necessary

        # if still not correct position, adjust the velocity vector
        if velocity_vector[X] > 0:
            velocity_vector[X] -= 1
        elif velocity_vector[X] < 0:
            velocity_vector[X] += 1
        velocity_vector[Y] -= 1
    return is_valid, highest_y_value


def part_two(file_name):
    x_threshold_1, x_threshold_2, y_threshold_1, y_threshold_2 = extract_data(file_name)

    print(f"field goes from x={x_threshold_1} to {x_threshold_2} and y = {y_threshold_1} to {y_threshold_2}")

    valid_counter = 0
    for x_value in range(0, x_threshold_2 + 1):
        for y_value in range(y_threshold_1, -y_threshold_1):
            starting_vector = [x_value, y_value]
            string = f"{starting_vector}"
            velocity_vector = starting_vector

            is_valid, highest_y_value = is_valid_vector_with_y_value(velocity_vector, x_threshold_1, x_threshold_2,
                                                                     y_threshold_1, y_threshold_2)

            if is_valid:
                print(f"  is {string} a valid starting vector? {is_valid}. Had maximum y of {highest_y_value}")
                valid_counter += 1

    print(f"valid counter is {valid_counter}")


if __name__ == "__main__":
    part_two("17_input.txt")
