import pprint


class Octopus:
    def __init__(self, energy_level, flashed):
        self.energy_level = int(energy_level)
        self.flashed = flashed

    def __str__(self):
        return str(self.energy_level)

    def __repr__(self):
        return self.__str__()


def extract_data(file_name):
    data = []
    with open(file_name) as file:
        lines = file.readlines()

        for line in lines:
            data.append(list(map(lambda x: Octopus(x, False), list(line.rstrip()))))

    return data


def part_one(file_name):
    octopus_matrix = extract_data(file_name)

    # iterate over all octopus
    # increase the energy level by 1
    # until no octopus wants to flash anymore
    #   check if any octopus flashes
    #   if so, set flashed to true and increment every octopus nearby
    #   iterate again to see if any new should flash
    #   if so, set flashed to true and increment every octopus nearby
    # set all flashed ones back to 0 and reset flash

    # pprint.pprint(octopus_matrix)
    flash_counter = 0
    for i in range(100):
        flash_counter = time_increment(octopus_matrix, flash_counter)

    print(f"flash counter at {flash_counter}")


def time_increment(octopus_matrix, flash_counter):
    for row_index in range(len(octopus_matrix)):
        current_row = octopus_matrix[row_index]
        for col_index in range(len(current_row)):
            curr_octopus = current_row[col_index]
            curr_octopus.energy_level += 1
    a_octopus_flashed = True
    flash_round_counter = 0
    while a_octopus_flashed:
        # print(f"flash round {flash_round_counter}")
        flash_round_counter += 1
        a_octopus_flashed = False
        for row_index in range(len(octopus_matrix)):
            current_row = octopus_matrix[row_index]
            for col_index in range(len(current_row)):
                curr_octopus = current_row[col_index]
                if curr_octopus.energy_level > 9 and not curr_octopus.flashed:
                    curr_octopus.flashed = True
                    a_octopus_flashed = True
                    flash_counter += 1

                    if row_index > 0 and col_index > 0:
                        octopus_matrix[row_index - 1][col_index - 1].energy_level += 1
                    if row_index > 0:
                        octopus_matrix[row_index - 1][col_index].energy_level += 1
                    if row_index > 0 and col_index < len(current_row) - 1:
                        octopus_matrix[row_index - 1][col_index + 1].energy_level += 1

                    if col_index > 0:
                        octopus_matrix[row_index][col_index - 1].energy_level += 1
                    if col_index < len(current_row) - 1:
                        octopus_matrix[row_index][col_index + 1].energy_level += 1

                    if row_index < len(octopus_matrix) - 1 and col_index > 0:
                        octopus_matrix[row_index + 1][col_index - 1].energy_level += 1
                    if row_index < len(octopus_matrix) - 1:
                        octopus_matrix[row_index + 1][col_index].energy_level += 1
                    if row_index < len(octopus_matrix) - 1 and col_index < len(current_row) - 1:
                        octopus_matrix[row_index + 1][col_index + 1].energy_level += 1
    for row_index in range(len(octopus_matrix)):
        current_row = octopus_matrix[row_index]
        for col_index in range(len(current_row)):
            curr_octopus = current_row[col_index]
            if curr_octopus.flashed:
                curr_octopus.energy_level = 0
                curr_octopus.flashed = False
    # pprint.pprint(octopus_matrix)
    return flash_counter


def is_all_zeros(octopus_matrix):
    for row_index in range(len(octopus_matrix)):
        current_row = octopus_matrix[row_index]
        for col_index in range(len(current_row)):
            curr_octopus = current_row[col_index]
            if curr_octopus.energy_level != 0:
                return False
    return True


def part_two(file_name):
    octopus_matrix = extract_data(file_name)
    flash_counter = 0
    increment_counter = 0
    while not is_all_zeros(octopus_matrix):
        increment_counter += 1
        flash_counter = time_increment(octopus_matrix, flash_counter)

    print(f"needed {increment_counter} steps")


if __name__ == "__main__":
    part_two("11_input.txt")
