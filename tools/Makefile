.PHONY: all clean

CXX = c++
CXXFLAGS = -std=c++20 -I./.
TARGET_DIR = ../src/McBopomofo

all: $(TARGET_DIR)/WebData.ts $(TARGET_DIR)/WebDataPlain.ts

encode: encode.cpp Mandarin.cpp
	$(CXX) -o $@ $^ $(CXXFLAGS)

$(TARGET_DIR)/WebData.ts: encode data.txt txt_to_map.py strip_emoji.js
	cat data.txt | ./encode | python3 txt_to_map.py > $@
	node strip_emoji.js $@

$(TARGET_DIR)/WebDataPlain.ts: encode data-plain-bpmf.txt txt_to_map.py strip_emoji.js
	cat data-plain-bpmf.txt | ./encode | python3 txt_to_map.py > $@
	node strip_emoji.js $@

clean:
	rm -f encode
