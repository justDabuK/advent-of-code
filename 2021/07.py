def extract_data(file_name):
    data = []
    with open(file_name) as file:
        lines = file.readlines()

        for line in lines:
            for digit in line.split(","):
                data.append(int(digit))

    return data


def part_one(file_name):
    data = extract_data(file_name)
    print(data)

    max_value = max(data)
    min_value = min(data)
    print(f"max {max_value}, min {min_value}")

    least_fuel = 1000000000000000
    position = 0
    for i in range(min_value, max_value + 1):
        fuel = 0
        for crab in data:
            #print(f"crab {crab} - index {i} : {abs(crab - i)}")
            fuel += abs(crab - i)

        if fuel < least_fuel:
            least_fuel = fuel
            position = i

    print(f"least fuel {least_fuel}, position {position}")


def part_two(file_name):
    data = extract_data(file_name)
    print(data)

    max_value = max(data)
    min_value = min(data)
    print(f"max {max_value}, min {min_value}")

    least_fuel = 1000000000000000
    position = 0
    for i in range(min_value, max_value + 1):
        print(f"{i}/{max_value + 1}")
        fuel = 0
        for crab in data:
            position_difference = abs(crab - i)
            necessary_fuel = 0
            for value in range(1, position_difference + 1):
                necessary_fuel += value
            fuel += necessary_fuel

        if fuel < least_fuel:
            least_fuel = fuel
            position = i

    print(f"least fuel {least_fuel}, position {position}")


if __name__ == "__main__":
    part_two("07_input.txt")
