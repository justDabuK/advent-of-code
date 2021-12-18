def part_one(file_name):
    data = extract_data(file_name)

    horizontal_pos = 0
    depth = 0

    for entry in data:
        if entry[0] == "forward":
            horizontal_pos += entry[1]
        elif entry[0] == "down":
            depth += entry[1]
        elif entry[0] == "up":
            depth -= entry[1]
        else:
            print(entry[0], "is a not known action")

    print("horizontal position", horizontal_pos)
    print("depth", depth)
    print("solution", horizontal_pos * depth)


def part_two(file_name):
    data = extract_data(file_name)

    horizontal_pos = 0
    depth = 0
    aim = 0

    for entry in data:
        if entry[0] == "forward":
            horizontal_pos += entry[1]
            depth += aim * entry[1]
        elif entry[0] == "down":
            aim += entry[1]
        elif entry[0] == "up":
            aim -= entry[1]
        else:
            print(entry[0], "is a not known action")

    print("horizontal position", horizontal_pos)
    print("aim", aim)
    print("depth", depth)
    print("solution", horizontal_pos * depth)


def extract_data(file_name):
    data = []
    with open(file_name) as file:
        lines = file.readlines()

        for line in lines:
            splitted_line = line.split(" ")
            data.append([splitted_line[0], int(splitted_line[1])])
    return data


if __name__ == "__main__":
    part_two("02_input.txt")
