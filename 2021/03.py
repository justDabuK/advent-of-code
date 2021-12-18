def extract_data(file_name):
    data = []
    with open(file_name) as file:
        lines = file.readlines()

        for line in lines:
            splitted_line = filter(lambda x: x != '\n', list(line))
            int_list = list(map(int, splitted_line))
            data.append(int_list)
    return data


def part_one(file_name):
    data = extract_data(file_name)

    counter = []
    for i in range(len(data[0])):
        counter.append([0, 0])

    for entry in data:
        for i in range(len(entry)):
            counter[i][entry[i]] += 1

    gamma = ""
    epsilon = ""

    for entry in counter:
        max_value = max(entry)
        max_index = entry.index(max_value)
        gamma += str(max_index)

        min_value = min(entry)
        min_index = entry.index(min_value)
        epsilon += str(min_index)

    print(f"gamma: {gamma} - {int(gamma, 2)}")
    print(f"epsilon: {epsilon} - {int(epsilon, 2)}")
    print(f"power consumption {int(gamma, 2) * int(epsilon, 2)}")


def has_correct_digit_oxygen(entry, counter_entry, index):
    max_index = 1
    if counter_entry[0] == counter_entry[1]:
        max_index = 1
    else:
        max_value = max(counter_entry)
        max_index = counter_entry.index(max_value)

    return entry[index] == max_index


def get_oxygen(data, index):
    if len(data) <= 1:
        oxygen = ""
        for digit in data[0]:
            oxygen += str(digit)
        return oxygen
    counter = []
    for i in range(len(data[0])):
        counter.append([0, 0])

    for entry in data:
        for i in range(len(entry)):
            counter[i][entry[i]] += 1

    filtered_data = list(filter(lambda x: has_correct_digit_oxygen(x, counter[index], index), data))
    return get_oxygen(filtered_data, index + 1)


def has_correct_digit_co2(entry, counter_entry, index):
    min_index = 0
    if counter_entry[0] == counter_entry[1]:
        min_index = 0
    else:
        min_value = min(counter_entry)
        min_index = counter_entry.index(min_value)

    return entry[index] == min_index


def get_co2(data, index):
    if len(data) <= 1:
        co2 = ""
        for digit in data[0]:
            co2 += str(digit)
        return co2
    counter = []
    for i in range(len(data[0])):
        counter.append([0, 0])

    for entry in data:
        for i in range(len(entry)):
            counter[i][entry[i]] += 1

    filtered_data = list(filter(lambda x: has_correct_digit_co2(x, counter[index], index), data))
    return get_co2(filtered_data, index + 1)


def part_two(file_name):
    data = extract_data(file_name)

    oxygen = get_oxygen(data, 0)
    co2 = get_co2(data, 0)

    print(f"oxygen: {oxygen} - {int(oxygen, 2)}")
    print(f"co2: {co2} - {int(co2, 2)}")
    print(f"life support rating: {int(oxygen, 2) * int(co2, 2)}")


if __name__ == "__main__":
    part_two("03_input.txt")
