from extract_data import extract_data


def part_one(file_name):
    data = extract_data(file_name)

    increase_count = count_increase(data)
    print("the depth increased ", increase_count, " times")


def count_increase(data):
    former_entry = None
    increase_count = 0
    for entry in data:
        if former_entry and former_entry < entry:
            increase_count += 1
        former_entry = entry
    return increase_count


def part_two(file_name):
    data = extract_data(file_name)

    tripled_data = []

    for i in range(len(data)):
        if (i + 2) <= (len(data) - 1):
            tripled_data.append((data[i] + data[i + 1] + data[i + 2]))

    increase_count = count_increase(tripled_data)
    print("the depth increased ", increase_count, " times")


if __name__ == "__main__":
    part_two("./01_input.txt")
