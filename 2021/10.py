import pprint


def extract_data(file_name):
    data = []
    with open(file_name) as file:
        lines = file.readlines()

        for line in lines:
            data.append(list(line.rstrip()))

    return data


def part_one(file_name):
    data = extract_data(file_name)

    # remove immediatly closed chunks
    incorrect_closing_list = []

    for line in data:
        get_incorrect_closing_tags(incorrect_closing_list, line)
    print(incorrect_closing_list)
    incorrect_sum = 0
    for tag in incorrect_closing_list:
        if tag == ")":
            incorrect_sum += 3
        elif tag == "]":
            incorrect_sum += 57
        elif tag == "}":
            incorrect_sum += 1197
        elif tag == ">":
            incorrect_sum += 25137
    print(f"sum is {incorrect_sum}")


def get_incorrect_closing_tags(incorrect_closing_list, line):
    if DEBUG:
        print(line)
    indices_to_remove = []
    find_indices_to_remove(indices_to_remove, line)
    while len(indices_to_remove) > 0:
        for index in range(len(indices_to_remove) - 1, -1, -1):
            line.pop(indices_to_remove[index])
        if DEBUG:
            print(line)
        indices_to_remove = []
        find_indices_to_remove(indices_to_remove, line)
    # find wrong partners
    for i in range(len(line)):
        if i < len(line) - 1:
            curr_sign = line[i]
            next_sign = line[i + 1]

            if curr_sign == "(" and next_sign in [']', '}', '>']:
                if DEBUG:
                    print(f"found incorrect closing {next_sign} at {i + 1}")
                incorrect_closing_list.append(next_sign)
            if curr_sign == "[" and next_sign in [')', '}', '>']:
                if DEBUG:
                    print(f"found incorrect closing {next_sign} at {i + 1}")
                incorrect_closing_list.append(next_sign)
            if curr_sign == "{" and next_sign in [')', ']', '>']:
                if DEBUG:
                    print(f"found incorrect closing {next_sign} at {i + 1}")
                incorrect_closing_list.append(next_sign)
            if curr_sign == "<" and next_sign in [')', ']', '}']:
                if DEBUG:
                    print(f"found incorrect closing {next_sign} at {i + 1}")
                incorrect_closing_list.append(next_sign)
    if DEBUG:
        print(line)


def find_indices_to_remove(indices_to_remove, line):
    for i in range(len(line)):
        if i < len(line) - 1:
            curr_sign = line[i]
            next_sign = line[i + 1]

            if is_valid_chunk('(', ')', curr_sign, next_sign, i):
                indices_to_remove.append(i)
                indices_to_remove.append(i + 1)
            if is_valid_chunk('{', '}', curr_sign, next_sign, i):
                indices_to_remove.append(i)
                indices_to_remove.append(i + 1)
            if is_valid_chunk('[', ']', curr_sign, next_sign, i):
                indices_to_remove.append(i)
                indices_to_remove.append(i + 1)
            if is_valid_chunk('<', '>', curr_sign, next_sign, i):
                indices_to_remove.append(i)
                indices_to_remove.append(i + 1)


def is_valid_chunk(opening_bracket, closing_bracket, curr_sign, next_sign, i):
    if curr_sign == opening_bracket and next_sign == closing_bracket:
        if DEBUG:
            print(f"found batch {curr_sign}{next_sign} at {i}-{i + 1}")
        return True
    return False


def part_two(file_name):
    data = extract_data(file_name)

    filter_out_corrupt_lines(data)
    score_list = list(map(get_score, data))
    sorted_scores = sorted(score_list)
    middle_index = int(len(sorted_scores)/2)

    print(f"middle score is {sorted_scores[middle_index]} at {middle_index}")




def get_score(line):
    sum = 0
    for index in range(len(line) - 1, -1, -1):
        entry = line[index]

        sum *= 5

        if entry == "(":
            sum += 1
        elif entry == "[":
            sum += 2
        elif entry == "{":
            sum += 3
        elif entry == "<":
            sum += 4
    return sum


def filter_out_corrupt_lines(data):
    # remove immediatly closed chunks
    corrupt_line_indices = []
    for line in data:
        if DEBUG:
            print(line)
        indices_to_remove = []
        find_indices_to_remove(indices_to_remove, line)
        while len(indices_to_remove) > 0:
            for index in range(len(indices_to_remove) - 1, -1, -1):
                line.pop(indices_to_remove[index])
            if DEBUG:
                print(line)
            indices_to_remove = []
            find_indices_to_remove(indices_to_remove, line)
        # find wrong partners
        is_corrupt = False
        for i in range(len(line)):
            if i < len(line) - 1:
                curr_sign = line[i]
                next_sign = line[i + 1]

                if curr_sign == "(" and next_sign in [']', '}', '>']:
                    if DEBUG:
                        print(f"found incorrect closing {next_sign} at {i + 1}")
                    is_corrupt = True
                if curr_sign == "[" and next_sign in [')', '}', '>']:
                    if DEBUG:
                        print(f"found incorrect closing {next_sign} at {i + 1}")
                    is_corrupt = True
                if curr_sign == "{" and next_sign in [')', ']', '>']:
                    if DEBUG:
                        print(f"found incorrect closing {next_sign} at {i + 1}")
                    is_corrupt = True
                if curr_sign == "<" and next_sign in [')', ']', '}']:
                    if DEBUG:
                        print(f"found incorrect closing {next_sign} at {i + 1}")
                    is_corrupt = True
        if DEBUG:
            print(line)
        if is_corrupt:
            corrupt_line_indices.append(data.index(line))
    for line_index in range(len(corrupt_line_indices) - 1, -1, -1):
        data.pop(corrupt_line_indices[line_index])


DEBUG = False

if __name__ == "__main__":
    part_two("10_input.txt")
