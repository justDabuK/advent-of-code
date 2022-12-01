import re


class Scanner:
    def __init__(self, scanner_id):
        self.scanner_id = scanner_id
        self.beacon_list = []

    def __str__(self):
        return f"scanner {self.scanner_id}, knows of {len(self.beacon_list)} beacons"

    def __repr__(self):
        return self.__str__()


def extract_data(file_name):
    scanner_list = []

    with open(file_name) as file_name:
        line_list = file_name.readlines()

        current_scanner = None

        for line in line_list:
            if "scanner" in line:
                result = re.search("--- scanner (\d+) ---", line)
                current_scanner = Scanner(int(result.group(1)))

            if "," in line:
                number_strings = line.rstrip().split(",")
                coordinates = list(map(int, number_strings))
                current_scanner.beacon_list.append(coordinates)

            if not line.rstrip():
                scanner_list.append(current_scanner)

        # ensure to add the last scanner
        scanner_list.append(current_scanner)

    return scanner_list

def part_one(file_name):
    scanner_list = extract_data(file_name)
    for scanner in scanner_list:
        # hmmm, maybe i try to find the relative vectors of all beacons
        vector_list = []


if __name__ == "__main__":
    part_one("19_test_input-2D.txt")
