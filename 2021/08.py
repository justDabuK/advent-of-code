class SignalEntry:
    def __init__(self, signal_pattern_list, output_value_list):
        self.signal_pattern_list = signal_pattern_list
        self.output_value_list = output_value_list

    def __str__(self):
        return f"{self.signal_pattern_list} | {self.output_value_list}"


def filter_empty_strings(list_of_strings):
    return list(filter(lambda x: x != "" and x != " ", list_of_strings))


def extract_data(file_name):
    data = []
    with open(file_name) as file:
        lines = file.readlines()

        for line in lines:
            unsplitted_pattern_string, unsplitted_output_value_string = line.rstrip().split("|")
            signal_pattern_list = filter_empty_strings(unsplitted_pattern_string.split(" "))
            output_value_list = filter_empty_strings(unsplitted_output_value_string.split(" "))
            data.append(SignalEntry(signal_pattern_list, output_value_list))

    return data


def count_unique_output_number_of_segments(note_entries, unique_output_length_patterns):
    unique_pattern_counter = 0
    for entry in note_entries:
        for output_value in entry.output_value_list:
            if len(output_value) in unique_output_length_patterns.values():
                unique_pattern_counter += 1
    return unique_pattern_counter


def part_one(file_name):
    note_entries = extract_data(file_name)

    unique_output_length_patterns = {
        "1": 2,
        "4": 4,
        "7": 3,
        "8": 7
    }

    unique_pattern_counter = count_unique_output_number_of_segments(note_entries,
                                                                    unique_output_length_patterns)

    print(f"{unique_pattern_counter} digit instances that use a unique number of segments")


DEBUG = False


def part_two(file_name):
    signal_entries = extract_data(file_name)

    output_sum = 0
    for entry in signal_entries:
        output_sum += int(get_output_value(entry))

    print(f"sum of outputs is {output_sum}")


def get_output_value(entry):
    segments = get_segments(entry)
    if DEBUG:
        print(f"{entry}")
        print(f"{segments}")
    # what we really need is the value of the output signal, which is the numbers added as strings
    output_value = ""
    for value in entry.output_value_list:
        output_value += str(get_value_for_signal(segments, value))
    return output_value


def get_value_for_signal(segments, signal):
    value = None
    if len(signal) == 2:
        value = 1
    elif len(signal) == 3:
        value = 7
    elif len(signal) == 4:
        value = 4
    elif len(signal) == 5:
        # it's either 2, 3 or 5
        characters_of_2 = segments["top"] + segments["top right"] + segments["middle"] + segments["bottom left"] + \
                          segments["bottom"]
        characters_of_3 = segments["top"] + segments["top right"] + segments["middle"] + segments["bottom right"] + \
                          segments["bottom"]
        characters_of_5 = segments["top"] + segments["top left"] + segments["middle"] + segments["bottom right"] + \
                          segments["bottom"]

        if is_candidate_for(characters_of_2, signal):
            value = 2
        if is_candidate_for(characters_of_3, signal):
            value = 3
        if is_candidate_for(characters_of_5, signal):
            value = 5
    elif len(signal) == 6:
        # it's either 0, 6 or 9
        characters_of_0 = segments["top"] + segments["top left"] + segments["top right"] + segments["bottom left"] + \
                          segments["bottom right"] + segments["bottom"]
        characters_of_6 = segments["top"] + segments["top left"] + segments["middle"] + segments["bottom left"] + \
                          segments["bottom right"] + segments["bottom"]
        characters_of_9 = segments["top"] + segments["top left"] + segments["top right"] + segments["middle"] + \
                          segments["bottom right"] + segments["bottom"]

        if is_candidate_for(characters_of_0, signal):
            value = 0
        if is_candidate_for(characters_of_6, signal):
            value = 6
        if is_candidate_for(characters_of_9, signal):
            value = 9
    elif len(signal) == 7:
        value = 8
    return value


def is_candidate_for(character_sequence, signal):
    candidate = True
    for character in signal:
        if character not in character_sequence:
            candidate = False
    return candidate


def get_segments(entry):
    unique_output_length_patterns = {
        "1": 2,
        "4": 4,
        "7": 3,
        "8": 7,
        "2 | 3 | 5": 5,
        "0 | 6 | 9": 6
    }
    # get uniqe entries
    potentially_sorted_entries = {}
    for signal_pattern in entry.signal_pattern_list:
        for key in unique_output_length_patterns:
            value = unique_output_length_patterns[key]
            if len(signal_pattern) == value:
                if key not in potentially_sorted_entries.keys():
                    potentially_sorted_entries[key] = []
                potentially_sorted_entries[key].append(signal_pattern)
    for output in entry.output_value_list:
        for key in unique_output_length_patterns:
            value = unique_output_length_patterns[key]
            if len(output) == value:
                if key not in potentially_sorted_entries.keys():
                    potentially_sorted_entries[key] = []
                potentially_sorted_entries[key].append(output)
    segments = {
        "top": None,
        "top left": None,
        "top right": None,
        "middle": None,
        "bottom left": None,
        "bottom right": None,
        "bottom": None
    }

    if DEBUG:
        print(potentially_sorted_entries)
    # top is the character that appears in seven but does not appear in 1
    for character in potentially_sorted_entries["7"][0]:
        if character not in potentially_sorted_entries["1"][0]:
            segments["top"] = character

    # find a possible 9
    # a 9 contains the character of 7 and 4 plus one additional character
    possible_nine = None
    chars_of_4_and_7 = potentially_sorted_entries["4"][0] + potentially_sorted_entries["7"][0]
    for entry in potentially_sorted_entries["0 | 6 | 9"]:
        additional_character_count = 0
        for character in entry:
            if character not in chars_of_4_and_7:
                additional_character_count += 1
        if additional_character_count == 1:
            possible_nine = entry
    # the one additional character is the bottom one
    for character in possible_nine:
        if character not in chars_of_4_and_7:
            segments["bottom"] = character
    # now the bottom left on is the one that does apper in 8 but not in 9
    for character in potentially_sorted_entries["8"][0]:
        if character not in possible_nine:
            segments["bottom left"] = character

    # next is the middle, the character that is in 8 but not in 0 is the one in the middle
    # the entry from "0 | 6 | 9" that is not 9 but does contain 1 is 0
    zero = None
    for entry in potentially_sorted_entries["0 | 6 | 9"]:
        if is_same_number(possible_nine, entry):
            continue
        if potentially_sorted_entries["1"][0][0] in entry and potentially_sorted_entries["1"][0][1] in entry:
            zero = entry
    for character in potentially_sorted_entries["8"][0]:
        if character not in zero:
            segments["middle"] = character

    # next is the top right, the character that appears in 8 but not in 6 is the one in the top right
    # 6 is the entry from "0 | 6 | 9" that is neither 0 nor 9
    six = None
    for entry in potentially_sorted_entries["0 | 6 | 9"]:
        if not is_same_number(possible_nine, entry) and not is_same_number(zero, entry):
            six = entry
    for character in potentially_sorted_entries["8"][0]:
        if character not in six:
            segments["top right"] = character

    # next is top left, the character that appears in 4, not in 1 and yet not in the known ones is the top left one
    for character in potentially_sorted_entries["4"][0]:
        if character not in potentially_sorted_entries["1"][0] and character not in segments.values():
            segments["top left"] = character
    # last one is bottom right, it's the last character that is part of eight but is yet not part of the segment values
    for character in potentially_sorted_entries["8"][0]:
        if character not in segments.values():
            segments["bottom right"] = character
    return segments


def is_same_number(compared_num, entry):
    is_nine = True
    for character in entry:
        if character not in compared_num:
            is_nine = False
    return is_nine


if __name__ == "__main__":
    part_two("08_input.txt")
