import copy
import json
import math


class SnailfishNumber:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"[{self.x} | {self.y}]"

    def __repr__(self):
        return self.__str__()

    def add(self, other):
        return SnailfishNumber(self, other)

    def x_need_split(self):
        return self.x >= 10 if is_int(self.x) else False

    def y_need_split(self):
        return self.y >= 10 if is_int(self.y) else False

    def __eq__(self, other):
        return self.__str__() == other.__str__()


def is_int(value):
    return type(value) == int

def string_to_snailfish(number_string):
    result = json.loads(number_string)

    return to_snailfish(result)

def to_snailfish(int_or_list):
    if is_int(int_or_list):
        return int_or_list
    elif len(int_or_list) == 2:
        return SnailfishNumber(to_snailfish(int_or_list[0]), to_snailfish(int_or_list[1]))
    else:
        print(f"{int_or_list} is neither int nor list with only two entries")

def apply_former_y_value(snailfish, former_y):
    if former_y is None:
        return former_y
    if is_int(snailfish.x):
        snailfish.x += former_y
        former_y = None
        return former_y
    else:
        former_y = apply_former_y_value(snailfish.x, former_y)
        if former_y is None:
            return former_y
    if is_int(snailfish.y):
        snailfish.y += former_y
        former_y = None
        return former_y
    else:
        former_y = apply_former_y_value(snailfish.y, former_y)
        if former_y is None:
            return former_y

    # if nothing works, just return the original value
    return former_y

def apply_former_x_value(snailfish, former_x):
    if former_x is None:
        return former_x
    if is_int(snailfish.y):
        snailfish.y += former_x
        former_x = None
        return former_x
    else:
        former_x = apply_former_x_value(snailfish.y, former_x)
        if former_x is None:
            return former_x
    if is_int(snailfish.x):
        snailfish.x += former_x
        former_x = None
        return former_x
    else:
        former_x = apply_former_x_value(snailfish.x, former_x)
        if former_x is None:
            return former_x

    # if nothing works, just return the original value
    return former_x

DEBUG = False

def would_explode(snailfish_number, depth_counter, former_x, former_y):
    had_an_explosion = False
    depth_counter += 1
    if depth_counter > 4:
        if DEBUG:
            print(f"  {snailfish_number} would explode")
        if is_int(snailfish_number.x) and is_int(snailfish_number.y):
            former_x = snailfish_number.x
            former_y = snailfish_number.y
            if DEBUG:
                print(f"  former values {former_x}, {former_y}")
            had_an_explosion = True
            return True, former_x, former_y, had_an_explosion
    if not is_int(snailfish_number.x):
        is_exploding, former_x, former_y, had_an_explosion = would_explode(snailfish_number.x, depth_counter, former_x, former_y)
        if is_exploding:
            snailfish_number.x = 0
        if former_y is not None:
            if is_int(snailfish_number.y):
                snailfish_number.y += former_y
                former_y = None
            else:
                former_y = apply_former_y_value(snailfish_number.y, former_y)

    if not had_an_explosion and not is_int(snailfish_number.y):
        is_exploding, former_x, former_y, had_an_explosion = would_explode(snailfish_number.y, depth_counter, former_x, former_y)
        if is_exploding:
            snailfish_number.y = 0
        if former_x is not None:
            if is_int(snailfish_number.x):
                snailfish_number.x += former_x
                former_x = None
            else:
                former_x = apply_former_x_value(snailfish_number.x, former_x)


    return False, former_x, former_y, had_an_explosion

def explode_once(snailfish_number):
    depth_counter = 0
    return would_explode(snailfish_number, depth_counter, None, None)[3]


def does_explode_work(origin_string, expected_string):
    snailfish = string_to_snailfish(origin_string)
    print(snailfish)
    explode_once(snailfish)
    expected_fish = string_to_snailfish(expected_string)
    assert_equal(snailfish, expected_fish, "explode")

def does_split_work(origin_string, expected_string):
    snailfish = string_to_snailfish(origin_string)
    print(snailfish)
    split_once(snailfish)
    expected_fish = string_to_snailfish(expected_string)
    assert_equal(snailfish, expected_fish, "split")


def assert_equal(snailfish, expected_fish, action):
    if snailfish == expected_fish:
        print(f"  {action} as expected -> {snailfish}")
    else:
        print(f"  ERROR: {snailfish} is not equal to {expected_fish}")


def split_once(snailfish_number):
    splitted_already = False
    if snailfish_number.x_need_split():
            former_x = snailfish_number.x
            half = former_x / 2
            half_rounded_down = math.floor(half)
            half_rounded_up = math.ceil(half)
            snailfish_number.x = SnailfishNumber(half_rounded_down, half_rounded_up)
            return True
    elif not is_int(snailfish_number.x):
        splitted_already = split_once(snailfish_number.x)
    if not splitted_already:
        if snailfish_number.y_need_split():
            former_y = snailfish_number.y
            half = former_y / 2
            half_rounded_down = math.floor(half)
            half_rounded_up = math.ceil(half)
            snailfish_number.y = SnailfishNumber(half_rounded_down, half_rounded_up)
            return True
        elif not is_int(snailfish_number.y):
            splitted_already = split_once(snailfish_number.y)
    return splitted_already

def reduce(snailfish_number):
    reduce_further = True
    while reduce_further:
        former_number = copy.deepcopy(snailfish_number)
        did_explode = explode_once(snailfish_number)
        if not did_explode:
            did_split = split_once(snailfish_number)
        reduce_further = did_explode or did_split

def extract_data(file_name):
    snailfish_number_list = []

    with open(file_name) as file:
        lines = file.readlines()

        for line in lines:
            snailfish_number_list.append(string_to_snailfish(line.rstrip()))

    return snailfish_number_list

def part_one(file_name):
    snailfish_number_list = extract_data(file_name)

    summed_up_number = sum_up_numbers(snailfish_number_list)

    return get_magnitude(summed_up_number)

def get_magnitude(snailfish_num):
    value_x = None
    if is_int(snailfish_num.x):
        value_x = snailfish_num.x
    else:
        value_x = get_magnitude(snailfish_num.x)

    value_y = None
    if is_int(snailfish_num.y):
        value_y = snailfish_num.y
    else:
        value_y = get_magnitude(snailfish_num.y)

    return 3*value_x + 2*value_y


def sum_up_numbers(snailfish_number_list):
    summed_up_number = None
    for number in snailfish_number_list:
        reduce(number)

        if summed_up_number is None:
            summed_up_number = number
        else:
            summed_up_number = summed_up_number.add(number)

        reduce(summed_up_number)
    return summed_up_number

def assert_equal_magnitude(num_string, expected_magnitude):
    actual = get_magnitude(string_to_snailfish(num_string))
    expected = expected_magnitude
    assert_equal(actual, expected, "calculated magnitude")


def test():
    print("--- string to snailfish ---")
    print(string_to_snailfish("[1,2]"))
    print(string_to_snailfish("[[1,2],3]"))
    print(string_to_snailfish("[9,[8,7]]"))
    print(string_to_snailfish("[[1,9],[8,5]]"))
    print(string_to_snailfish("[[[[1,2],[3,4]],[[5,6],[7,8]]],9]"))
    print(string_to_snailfish("[[[9,[3,8]],[[0,9],6]],[[[3,7],[4,9]],3]]"))
    print(string_to_snailfish("[[[[1,3],[5,3]],[[1,3],[8,7]]],[[[4,9],[6,9]],[[8,2],[7,3]]]]"))

    print("--- add ---")
    print(SnailfishNumber(1, 2).add(SnailfishNumber(SnailfishNumber(3, 4), 5)))

    print("--- explode once ---")
    does_explode_work("[[[[[9,8],1],2],3],4]", "[[[[0,9],2],3],4]")
    does_explode_work("[7,[6,[5,[4,[3,2]]]]]", "[7,[6,[5,[7,0]]]]")
    does_explode_work("[[6,[5,[4,[3,2]]]],1]", "[[6,[5,[7,0]]],3]")
    does_explode_work("[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]", "[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]")
    does_explode_work("[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]", "[[3,[2,[8,0]]],[9,[5,[7,0]]]]")

    print("--- split once ---")
    does_split_work("[10,0]", "[[5,5],0]")
    does_split_work("[0,10]", "[0,[5,5]]")
    does_split_work("[10,10]", "[[5,5], 10]")
    does_split_work("[11,10]", "[[5,6], 10]")
    does_split_work("[[5,5], 10]", "[[5,5],[5,5]]")
    does_split_work("[[5,5], 11]", "[[5,5],[5,6]]")
    result = split_once(string_to_snailfish("[[5,5], 9]"))
    if not result:
        print("split returns correctly a false positive")
    else:
        print("ERROR: should not split, but said it split")
    result = split_once(string_to_snailfish("[[5,5], 10]"))
    if result:
        print("split returns correctly a true positive")
    else:
        print("ERROR: should split, but said it did not")
    result = explode_once(string_to_snailfish("[[5,5], 9]"))
    if not result:
        print("explode returns correctly a false positive")
    else:
        print("ERROR: should not explode, but said it did")
    result = explode_once(string_to_snailfish("[[[[[9,8],1],2],3],4]"))
    if result:
        print("explode returns correctly a true positive")
    else:
        print("ERROR: should explode, but said it did not")

    print("--- first go through ---")
    num_1 = string_to_snailfish("[[[[4,3],4],4],[7,[[8,4],9]]]")
    num_2 = string_to_snailfish("[1,1]")

    added_num = num_1.add(num_2)
    expected_after_addition = string_to_snailfish("[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]")
    assert_equal(added_num, expected_after_addition, "added")

    explode_once(added_num)
    split_once(added_num)
    expected_after_first_explode = string_to_snailfish("[[[[0,7],4],[7,[[8,4],9]]],[1,1]]")
    assert_equal(added_num, expected_after_first_explode, "explode and split")

    explode_once(added_num)
    expected_after_second_explode = string_to_snailfish("[[[[0,7],4],[15,[0,13]]],[1,1]]")
    assert_equal(added_num, expected_after_second_explode, "explode")
    split_once(added_num)
    expected_after_first_split =  string_to_snailfish("[[[[0,7],4],[[7,8],[0,13]]],[1,1]]")
    assert_equal(added_num, expected_after_first_split, "split")

    explode_once(added_num)
    split_once(added_num)
    expected_after_second_split =  string_to_snailfish("[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]")
    assert_equal(added_num, expected_after_second_split, "explode and split")

    explode_once(added_num)
    split_once(added_num)
    expected_after_third_explode = string_to_snailfish("[[[[0,7],4],[[7,8],[6,0]]],[8,1]]")
    assert_equal(added_num, expected_after_third_explode, "explode and split")


    num_1 = string_to_snailfish("[[[[4,3],4],4],[7,[[8,4],9]]]")
    num_2 = string_to_snailfish("[1,1]")

    print("--- reduce ---")
    added_num = num_1.add(num_2)
    reduce(added_num)
    after_reduce_num = string_to_snailfish("[[[[0,7],4],[[7,8],[6,0]]],[8,1]]")
    assert_equal(added_num, after_reduce_num, "reduce")

    print("--- summed up ---")
    assertion_pair = [
        ["18_test_input-1.txt", "[[[[1,1],[2,2]],[3,3]],[4,4]]"],
        ["18_test_input-2.txt", "[[[[3,0],[5,3]],[4,4]],[5,5]]"],
        ["18_test_input-3.txt", "[[[[5,0],[7,4]],[5,5]],[6,6]]"],
        ["18_test_input-4.txt", "[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]"]
    ]
    for pair in assertion_pair:
        snailfish_number_list = extract_data(pair[0])
        actual = sum_up_numbers(snailfish_number_list)
        expected = string_to_snailfish(pair[1])
        assert_equal(actual, expected, "summed up")

    print("--- magnitude ---")
    assert_equal_magnitude("[9,1]", 29)
    assert_equal_magnitude("[[9,1],[1,9]]", 129)
    assert_equal_magnitude("[[1,2],[[3,4],5]]", 143)
    assert_equal_magnitude("[[[[0,7],4],[[7,8],[6,0]]],[8,1]]", 1384)
    assert_equal_magnitude("[[[[1,1],[2,2]],[3,3]],[4,4]]", 445)
    assert_equal_magnitude("[[[[3,0],[5,3]],[4,4]],[5,5]]", 791)
    assert_equal_magnitude("[[[[5,0],[7,4]],[5,5]],[6,6]]", 1137)
    assert_equal_magnitude("[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]", 3488)

    print("--- part one ---")
    actual = part_one("18_test_input-5.txt")
    expected = 4140
    assert_equal(actual, expected, "part one calculation")

    actual = part_one("18_input.txt")
    expected = 4480
    assert_equal(actual, expected, "part one calculation")

    print("--- part two ---")
    actual = part_two("18_test_input-5.txt")
    expected = 3993
    assert_equal(actual, expected, "part two calculation")

    actual = part_two("18_input.txt")
    expected = 4676
    assert_equal(actual, expected, "part two calculation")

def part_two(file_name):
    snailfish_number_list = extract_data(file_name)

    largest_possible_magnitude = 0

    for list_index in range(len(snailfish_number_list)):
        first_number = snailfish_number_list[list_index]

        for second_list_index in range(len(snailfish_number_list)):
            second_number = snailfish_number_list[second_list_index]

            summed_number = sum_up_numbers([copy.deepcopy(first_number), copy.deepcopy(second_number)])

            magnitude = get_magnitude(summed_number)
            if magnitude > largest_possible_magnitude:
                largest_possible_magnitude = magnitude

    return largest_possible_magnitude

if __name__ == "__main__":
    maximum_of_two_sum_magnitude = part_two("18_input.txt")
    print(f"maximum of two magnitude is {maximum_of_two_sum_magnitude}")



