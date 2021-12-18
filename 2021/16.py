NUM_BITS_NUMBER_OF = 11
NUMBER_OF_NUMBER_OF_BITS = 11
NUMBER_INDICATOR = "1"
NUM_OF_FIRST_PACKAGE = 11
NUMBER_OF_LENGTH_BITS = 15
LENGTH_INDICATOR = "0"
NUMBER_OF_INDICATOR = "1"
LITERAL = 4
DEBUG = False


def extract_data(file_name):
    hexadecimal_byte_string = None

    with open(file_name) as file:
        lines = file.readlines()

        for line in lines:
            hexadecimal_byte_string = line.rstrip()

    return hexadecimal_byte_string


hex_to_binary_map = {
    "0": "0000",
    "1": "0001",
    "2": "0010",
    "3": "0011",
    "4": "0100",
    "5": "0101",
    "6": "0110",
    "7": "0111",
    "8": "1000",
    "9": "1001",
    "A": "1010",
    "B": "1011",
    "C": "1100",
    "D": "1101",
    "E": "1110",
    "F": "1111"
}


def sum_up_versions(binary_string):
    # get version and package id
    if DEBUG:
        print(binary_string)
    version_sum = 0
    version = int(binary_string[:3], 2)
    version_sum += version
    type_id = int(binary_string[3:6], 2)
    if DEBUG:
        print(f"  has version: {version} & type: {type_id}")
    if type_id == LITERAL:
        if DEBUG:
            print("  is literal package")
        literal_string = binary_string[6:]
        resulting_number_string, literal_string = get_resulting_number(literal_string)
        if DEBUG:
            print(f"  resulting number is {int(resulting_number_string, 2)}")
        if DEBUG:
            print(f"  remaining string {literal_string}")
        return literal_string, version_sum
    else:
        if DEBUG:
            print("  is operator package")
        operator_string = binary_string[6:]
        length_type_id = operator_string[0]
        remaining_operator_string = operator_string[1:]
        if length_type_id == LENGTH_INDICATOR:
            sub_packet_length = int(remaining_operator_string[:NUMBER_OF_LENGTH_BITS], 2)
            remaining_operator_string = remaining_operator_string[NUMBER_OF_LENGTH_BITS:]

            if DEBUG:
                print(f"  going for lenght of {sub_packet_length} bits")
            if DEBUG:
                print(f"  remaining string {remaining_operator_string}")
            used_sub_packet_bits = 0
            while used_sub_packet_bits < sub_packet_length:
                len_before_parsing = len(remaining_operator_string)
                remaining_operator_string, curr_version = sum_up_versions(remaining_operator_string)
                version_sum += curr_version
                len_after_parsing = len(remaining_operator_string)
                used_sub_packet_bits += len_before_parsing - len_after_parsing
                if DEBUG:
                    print(f"  remaining string {remaining_operator_string}")
                if DEBUG:
                    print(f"  used bits {used_sub_packet_bits}")
            return remaining_operator_string, version_sum
        elif length_type_id == NUMBER_OF_INDICATOR:
            number_of_sub_packages = int(remaining_operator_string[:NUM_BITS_NUMBER_OF], 2)
            remaining_operator_string = remaining_operator_string[NUM_BITS_NUMBER_OF:]
            if DEBUG:
                print(f"  going for number of {number_of_sub_packages} packages")

            parsed_sub_packages = 0
            while parsed_sub_packages < number_of_sub_packages:
                remaining_operator_string, curr_version = sum_up_versions(remaining_operator_string)
                version_sum += curr_version
                parsed_sub_packages += 1
                if DEBUG:
                    print(f"  parsed number {parsed_sub_packages} of {number_of_sub_packages}")
                if DEBUG:
                    print(f"  remaining string {remaining_operator_string}")
            return remaining_operator_string, version_sum
    return "", version_sum


def get_resulting_number(literal_string):
    resulting_number_string = ""
    next_byte = literal_string[:5]
    literal_string = literal_string[5:]
    while next_byte[0] == "1":
        resulting_number_string += next_byte[1:]
        next_byte = literal_string[:5]
        literal_string = literal_string[5:]
    # the last bit should also go into the resulting_number string
    resulting_number_string += next_byte[1:]
    return resulting_number_string, literal_string


def to_binary_string(hex_byte_string):
    # 1. hex to binary
    binary_string = ""
    for hex_byte in hex_byte_string:
        binary_string += hex_to_binary_map[hex_byte]
    return binary_string


def part_one(file_name):
    hex_byte_string = extract_data(file_name)
    if DEBUG:
        print(hex_byte_string)

    binary_string = to_binary_string(hex_byte_string)

    if DEBUG:
        print(binary_string)

    remaining_bits, version_sum = sum_up_versions(binary_string)
    print(f"version sum {version_sum}")


def part_two(file_name):
    hex_byte_string = extract_data(file_name)
    if DEBUG:
        print(hex_byte_string)

    binary_string = to_binary_string(hex_byte_string)

    remaining_bits, value = get_value(binary_string)
    print(f"{hex_byte_string} -> {value}")


def get_value(binary_string):
    # get version and package id
    if DEBUG:
        print(binary_string)
    value = 0
    version = int(binary_string[:3], 2)
    type_id = int(binary_string[3:6], 2)
    if DEBUG:
        print(f"  has version: {version} & type: {type_id}")
    if type_id == LITERAL:
        if DEBUG:
            print("  is literal package")
        literal_string = binary_string[6:]
        resulting_number_string, literal_string = get_resulting_number(literal_string)
        resulting_number = int(resulting_number_string, 2)
        if DEBUG:
            print(f"  resulting number is {resulting_number}")
        if DEBUG:
            print(f"  remaining string {literal_string}")
        value += resulting_number
        return literal_string, value
    else:
        if DEBUG:
            print("  is operator package")
        operator_string = binary_string[6:]
        length_type_id = operator_string[0]
        remaining_operator_string = operator_string[1:]

        # start of magic
        intermediate_value = None
        if type_id == 0:
            intermediate_value = 0
        elif type_id == 1:
            intermediate_value = 1
        else:
            intermediate_value = []
        if DEBUG:
            print(f"  -> intermediate_value starts with {intermediate_value}")

        if length_type_id == LENGTH_INDICATOR:
            sub_packet_length = int(remaining_operator_string[:NUMBER_OF_LENGTH_BITS], 2)
            remaining_operator_string = remaining_operator_string[NUMBER_OF_LENGTH_BITS:]

            if DEBUG:
                print(f"  going for lenght of {sub_packet_length} bits")
            if DEBUG:
                print(f"  remaining string {remaining_operator_string}")
            used_sub_packet_bits = 0

            while used_sub_packet_bits < sub_packet_length:
                len_before_parsing = len(remaining_operator_string)
                remaining_operator_string, curr_value = get_value(remaining_operator_string)

                if type_id == 0:
                    intermediate_value += int(curr_value)
                elif type_id == 1:
                    intermediate_value *= int(curr_value)
                else:
                    intermediate_value.append(int(curr_value))
                if DEBUG:
                    print(f"  -> intermediate_value is now {intermediate_value}")

                len_after_parsing = len(remaining_operator_string)
                used_sub_packet_bits += len_before_parsing - len_after_parsing
                if DEBUG:
                    print(f"  remaining string {remaining_operator_string}")
                if DEBUG:
                    print(f"  used bits {used_sub_packet_bits}")

            if type_id in [0, 1]:
                value += intermediate_value
            elif type_id == 2:
                value = min(intermediate_value)
            elif type_id == 3:
                value = max(intermediate_value)
            elif type_id == 5:
                value = 1 if intermediate_value[0] > intermediate_value[1] else 0
            elif type_id == 6:
                value = 1 if intermediate_value[0] < intermediate_value[1] else 0
            elif type_id == 7:
                value = 1 if intermediate_value[0] == intermediate_value[1] else 0

            if DEBUG:
                print(f"  -> returned value will be {value}")

            return remaining_operator_string, value
        elif length_type_id == NUMBER_OF_INDICATOR:
            number_of_sub_packages = int(remaining_operator_string[:NUM_BITS_NUMBER_OF], 2)
            remaining_operator_string = remaining_operator_string[NUM_BITS_NUMBER_OF:]
            if DEBUG:
                print(f"  going for number of {number_of_sub_packages} packages")

            parsed_sub_packages = 0
            while parsed_sub_packages < number_of_sub_packages:
                remaining_operator_string, curr_value = get_value(remaining_operator_string)

                if DEBUG:
                    print(f"  -> curr_value: {curr_value}")

                if type_id == 0:
                    intermediate_value += int(curr_value)
                elif type_id == 1:
                    intermediate_value *= int(curr_value)
                else:
                    intermediate_value.append(int(curr_value))

                if DEBUG:
                    print(f"  -> intermediate_value is now {intermediate_value}")

                parsed_sub_packages += 1
                if DEBUG:
                    print(f"  parsed number {parsed_sub_packages} of {number_of_sub_packages}")
                if DEBUG:
                    print(f"  remaining string {remaining_operator_string}")

            if type_id in [0, 1]:
                value += intermediate_value
            elif type_id == 2:
                value = min(intermediate_value)
            elif type_id == 3:
                value = max(intermediate_value)
            elif type_id == 5:
                value = 1 if intermediate_value[0] > intermediate_value[1] else 0
            elif type_id == 6:
                value = 1 if intermediate_value[0] < intermediate_value[1] else 0
            elif type_id == 7:
                value = 1 if intermediate_value[0] == intermediate_value[1] else 0

            if DEBUG:
                print(f"  -> returned value will be {value}")
            return remaining_operator_string, value
    return "", value


if __name__ == "__main__":
    part_two("16_input.txt")
