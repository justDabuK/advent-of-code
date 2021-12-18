import numpy as np


def extract_data(file_name):
    data = []
    with open(file_name) as file:
        lines = file.readlines()

        for line in lines:
            for digit in line.split(","):
                data.append(int(digit))

    return data


def fish_mating_for_some_days(data, days):
    # 2 steps
    for i in range(days):
        # reduce all counters
        for fish_index in range(len(data)):
            data[fish_index] -= 1

        # reset and spawn counters
        for fish_index in range(len(data)):
            if data[fish_index] <= -1:
                data[fish_index] = 6
                data.append(8)
        print(f"{len(data)} fish after mating day {i + 1} / {days}")
    print(f"there are {len(data)} fish after {days} days")


def part_one(file_name):
    data = extract_data(file_name)
    days = 256

    #fish_mating_for_some_days(data, days)

    days_to_double_counter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    for fish in data:
        days_to_double_counter[fish] += 1
    print(f"fish {data}")
    print(f"counter {days_to_double_counter}")

    for i in range(days):
        # need to respawn?
        days_to_double_counter[7] += days_to_double_counter[0]
        days_to_double_counter[9] += days_to_double_counter[0]

        for j in range(9):
            days_to_double_counter[j] = days_to_double_counter[j+1]
        days_to_double_counter[9] = 0
        print(f"day {i} status: {days_to_double_counter}")
    print(f"fish status {days_to_double_counter}")
    fish_sum = 0
    for counter in days_to_double_counter:
        fish_sum += counter
    print(f"fish count {fish_sum}")


def part_two(file_name):
    data = extract_data(file_name)
    days = 256

    fish_mating_for_some_days(data, days)


if __name__ == "__main__":
    part_one("06_input.txt")
