# Directory definitions
PUBLIC_DIR      := public
DIST_DIR        := dist

STYLES_DIR      := $(PUBLIC_DIR)/styles
SCRIPTS_DIR     := $(PUBLIC_DIR)/scripts
IMAGES_SRC_DIR  := $(PUBLIC_DIR)/img

CSS_MINIFIED    := $(DIST_DIR)/styles/main.css
JS_MINIFIED     := $(DIST_DIR)/scripts/main.js
IMAGES_DIST_DIR := $(DIST_DIR)/img

# The domain-relative path to the images directory
IMAGES_PATH     := /projects/bear/img

# The <link> tag we want to replace
LINK_STR        := <link rel="stylesheet" href="styles/main.css">

# 1) Find the byte offset (0-based) where LINK_STR starts in public/index.html
LINK_START      := $(shell grep -ob '$(LINK_STR)' $(PUBLIC_DIR)/index.html | head -n 1 | cut -d: -f1)

# 2) Measure the length of LINK_STR in bytes
LINK_LEN        := $(shell printf '%s' '$(LINK_STR)' | wc -c | tr -d '[:space:]')

# 3) The "end" offset is the first byte after LINK_STR
LINK_END        := $(shell echo $$(( $(LINK_START) + $(LINK_LEN) )))

.PHONY: build copy-images clean serve

# The main build target depends on:
#   - copied images
#   - minified JS
#   - minified CSS
#   - the final index.html (with CSS inlined)
build: copy-images $(JS_MINIFIED) $(CSS_MINIFIED) $(DIST_DIR)/index.html

##############################
# 1) Copy images
##############################
copy-images:
	@mkdir -p $(IMAGES_DIST_DIR)
	@cp -r $(IMAGES_SRC_DIR)/* $(IMAGES_DIST_DIR)

##############################
# 2) Minify JS
##############################
$(JS_MINIFIED): $(SCRIPTS_DIR)/main.js
	@mkdir -p $(DIST_DIR)/scripts
	@npx --yes uglify-js --compress -- $< > $@

##############################
# 3) Minify CSS
##############################
$(CSS_MINIFIED): $(STYLES_DIR)/main.css
	@mkdir -p $(DIST_DIR)/styles
	@npx --yes lightningcss-cli --minify --bundle $< -o $@
	@# Replace image paths in CSS
	@npx --yes replace-in-files-cli --string "../img/" --replacement "$(IMAGES_PATH)/" $@

##############################
# 4) Inline CSS in index.html
##############################
$(DIST_DIR)/index.html: $(PUBLIC_DIR)/index.html $(CSS_MINIFIED)
	@mkdir -p $(DIST_DIR)

	@# (a) Write everything from byte 0 up to (but not including) LINK_START
	@head -c $(LINK_START) $< > $@

	@# (b) Insert the <style> tag
	@echo '<style>' >> $@

	@# (c) Inject the minified CSS
	@cat $(CSS_MINIFIED) >> $@

	@# (d) Close the style tag
	@echo '\n    </style>' >> $@

	@# (e) Write everything after LINK_END
	@#     Note: tail -c +N means "start reading at byte N (1-based offset)"
	@tail -c +$$(( $(LINK_END) + 1 )) $< >> $@

	@echo "Built $(DIST_DIR)"

##############################
# Cleanup
##############################
clean:
	rm -rf $(DIST_DIR)

##############################
# Local dev server
##############################
serve:
	npx --y serve $(PUBLIC_DIR)
