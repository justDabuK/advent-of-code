import re
import numpy
import numpy as np


class Line:
    def __init__(self, x1, y1, x2, y2):
        self.x1 = x1
        self.y1 = y1
        self.x2 = x2
        self.y2 = y2

    def __str__(self):
        return f"{self.x1},{self.y1} -> {self.x2}, {self.y2}"

    def __repr__(self):
        return self.__str__()

    def is_horizontal(self):
        return self.x1 == self.x2

    def is_vertical(self):
        return self.y1 == self.y2

    def is_diagonal(self):
        x2_ = self.x2 - self.x1
        y2_ = self.y2 - self.y1
        angle = np.abs(numpy.arctan2(y2_, x2_) * 180 / np.pi)
        return angle != 0 and angle != 180 and angle != 90 and angle != 360 and angle % 45 == 0


def extract_data(file_name):
    data = []
    with open(file_name) as file:
        lines = file.readlines()

        for line in lines:
            result = re.search(
                "(\d|[0-9][0-9]|[0-9][0-9][0-9]),(\d|[0-9][0-9]|[0-9][0-9][0-9]) -> (\d|[0-9][0-9]|[0-9][0-9][0-9]),(\d|[0-9][0-9]|[0-9][0-9][0-9])\\n",
                line)
            data.append(Line(int(result.group(1)), int(result.group(2)), int(result.group(3)), int(result.group(4))))

    return data


def part_one(file_name):
    data = extract_data(file_name)

    field = get_field(data)

    for entry in data:
        if entry.is_horizontal():
            step = 1 if entry.y1 <= entry.y2 else -1
            for x in range(entry.y1, entry.y2 + step, step):
                field[entry.x1, x] += 1
        elif entry.is_vertical():
            step = 1 if entry.x1 <= entry.x2 else -1
            for x in range(entry.x1, entry.x2 + step, step):
                field[x, entry.y1] += 1
        # else:
        #     print(f"{entry} is neither horizontal nor vertical")

    two_occurrences = field >= 2
    print(f"2 occurrences: {numpy.count_nonzero(two_occurrences)}")


def part_two(file_name):
    data = extract_data(file_name)

    field = get_field(data)

    for entry in data:
        if entry.is_horizontal():
            step = 1 if entry.y1 <= entry.y2 else -1
            for y in range(entry.y1, entry.y2 + step, step):
                field[entry.x1, y] += 1
        elif entry.is_vertical():
            step = 1 if entry.x1 <= entry.x2 else -1
            for x in range(entry.x1, entry.x2 + step, step):
                field[x, entry.y1] += 1
        elif entry.is_diagonal():
            step_x = 1 if entry.x1 <= entry.x2 else -1
            step_y = 1 if entry.y1 <= entry.y2 else -1
            for x, y in zip(range(entry.x1, entry.x2 + step_x, step_x), range(entry.y1, entry.y2 + step_y, step_y)):
                field[x, y] += 1
        else:
            print(f"{entry} is neither horizontal nor vertical")

    two_occurrences = field >= 2
    print(f"2 occurrences: {numpy.count_nonzero(two_occurrences)}")


def get_field(data):
    max_x = 0
    max_y = 0
    for entry in data:
        if entry.x1 > max_x:
            max_x = entry.x1
        if entry.y1 > max_x:
            max_y = entry.y1
        if entry.x2 > max_x:
            max_x = entry.x2
        if entry.y2 > max_x:
            max_y = entry.y2
    field = numpy.zeros((max_x + 1, max_y + 1))
    return field


if __name__ == "__main__":
    part_two("05_input.txt")
