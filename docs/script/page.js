
const Demopage = (function() {
    const errorsBlockId = "error-messages";
    const errorsBlock = document.getElementById(errorsBlockId);
    if (!errorsBlock) {
        console.error("Cannot find element '" + errorsBlockId + "'.");
    }

    function getErrorById(id) {
        return errorsBlock.querySelector("span[id=error-message-" + id +"]");
    }

    return Object.freeze({
        setErrorMessage: function(id, message) {
            if (errorsBlock) {
                const span = getErrorById(id);
                if (span) {
                    span.innerHTML = message;
                    return;
                } else {
                    const span = document.createElement("span");
                    span.id = "error-message-" + id;
                    span.innerText = message;
                    errorsBlock.appendChild(span);
                    errorsBlock.appendChild(document.createElement("br"));
                }
            }
        },

        removeErrorMessage: function(id) {
            if (errorsBlock) {
                const span = getErrorById(id);
                if (span) {
                    const br = span.nextElementSibling;
                    if (br) {
                        errorsBlock.removeChild(br);
                    }
                    errorsBlock.removeChild(span);
                }
            }
        },
    });
})();

const Canvas = (function() {
    function getElementBySelector(selector) {
        const elt = document.querySelector(selector);
        if (!elt) {
            console.error("Cannot find element '" + selector + "'.");
        }
        return elt;
    }

    function getCanvasById(id) {
        return getElementBySelector("canvas[id=" + id + "]");
    }

    function getCheckboxFromId(id) {
        return getElementBySelector("input[type=checkbox][id=" + id + "]");
    }

    const canvasContainer = document.getElementById("canvas-container");
    const canvas = getCanvasById("canvas");
    const buttonsColumn = document.getElementById("canvas-buttons-column");
    const fullscreenCheckbox = getCheckboxFromId("fullscreen-checkbox-id");
    const loader = canvasContainer.querySelector(".loader");

    let maxWidth = 512;
    let maxHeight = 512;

    (function BindCanvasButtons() {
        function hideOverflow(value) {
            document.body.style.overflow = value ? "hidden" : "auto";
        }

        const sidePaneCheckbox = getCheckboxFromId("side-pane-checkbox-id");

        if (fullscreenCheckbox) {
            window.addEventListener("load", function() {
                hideOverflow(fullscreenCheckbox.checked);
                fullscreenCheckbox.addEventListener("change", function() {
                    hideOverflow(fullscreenCheckbox.checked);
                });
            }, false);

            if (sidePaneCheckbox) {
                fullscreenCheckbox.addEventListener("change", function() {
                    if (fullscreenCheckbox.checked) {
                        sidePaneCheckbox.checked = false;
                    }
                }, false);
            }
        }
    })();

    function callObservers(observersList) {
        const args = Array.prototype.slice.call(arguments, 1);
        for (let i = 0; i < observersList.length; ++i) {
            observersList[i].apply(null, args);
        }
    }

    function getCanvasSize() {
        const rect = canvas.getBoundingClientRect();
        return [Math.floor(rect.width), Math.floor(rect.height)];
    }

    let lastCanvasSize = [0, 0];
    const canvasResizeObservers = [];

    function inPx(size) {
        return size + "px";
    }

    function updateCanvasSize() {
        canvasContainer.style["width"] = "100vw";
        let [curWidth, curHeight] = getCanvasSize();

        if (fullscreenCheckbox.checked) {
            canvasContainer.style["height"] = "100%";
            canvasContainer.style["max-width"] = "";
            canvasContainer.style["max-height"] = "";
        } else {
            curHeight = curWidth * maxHeight / maxWidth;

            canvasContainer.style["height"] = inPx(curHeight);
            canvasContainer.style["max-width"] = inPx(maxWidth);
            canvasContainer.style["max-height"] = inPx(maxHeight);
        }

        if (curWidth !== lastCanvasSize[0] ||
            curHeight !== lastCanvasSize[1]) {
            lastCanvasSize = getCanvasSize();

            callObservers(canvasResizeObservers,
                lastCanvasSize[0], lastCanvasSize[1]);
        }
    }

    window.addEventListener("load", updateCanvasSize, false);
    fullscreenCheckbox.addEventListener("change", updateCanvasSize, false);
    window.addEventListener("resize", updateCanvasSize, false);

    const lastMousePosition = [];
    let isMouseDown = false;

    const fullscreenToggleObservers = [updateCanvasSize];
    const mouseDownObservers = [];
    const mouseDragObservers = [];
    const mouseEnterObservers = [];
    const mouseLeaveObservers = [];
    const mouseMoveObservers = [];
    const mouseUpObservers = [];
    const mouseWheelObservers = [];

    if (fullscreenCheckbox) {
        fullscreenCheckbox.addEventListener("change", function() {
            callObservers(fullscreenToggleObservers,
                fullscreenCheckbox.checked);
        }, false);
    }

    if (canvas) {
        canvas.addEventListener("mousedown", function(event) {
            if (event.button === 0) {
                isMouseDown = true;
                callObservers(mouseDownObservers);
            }
        }, false);

        canvas.addEventListener("mouseenter", function() {
            callObservers(mouseEnterObservers);
        }, false);

        canvas.addEventListener("mouseleave", function() {
            callObservers(mouseLeaveObservers);
        }, false);

        canvas.addEventListener("wheel", function(event) {
            if (mouseWheelObservers.length > 0) {
                callObservers(mouseWheelObservers, Math.sign(event.deltaY));
                event.preventDefault();
                return false;
            }
            return true;
        }, false);

        window.addEventListener("mousemove", function(event) {
            const rect = canvas.getBoundingClientRect();
            const newX = (event.clientX - rect.left) / rect.width;
            const newY = (event.clientY - rect.top) / rect.height;

            const dX = newX - lastMousePosition[0];
            const dY = newY - lastMousePosition[1];

            lastMousePosition[0] = newX;
            lastMousePosition[1] = newY;

            if (isMouseDown) {
                callObservers(mouseDragObservers, dX, dY);
            }

            callObservers(mouseMoveObservers, newX, newY);
        });

        window.addEventListener("mouseup", function(event) {
            if (event.button === 0 && isMouseDown) {
                isMouseDown = false;
                callObservers(mouseUpObservers);
            }
        });
    }

    return Object.freeze({
        Observers: Object.freeze({
            canvasResize: canvasResizeObservers,
            fullscreenToggle: fullscreenToggleObservers,
            mouseDown: mouseDownObservers,
            mouseDrag: mouseDragObservers,
            mouseEnter: mouseEnterObservers,
            mouseLeave: mouseLeaveObservers,
            mouseMove: mouseMoveObservers,
            mouseWheel: mouseWheelObservers,
            mouseUp: mouseUpObservers,
        }),

        getAspectRatio: function() {
            const size = getCanvasSize();
            return size[0] / size[1];
        },

        getCanvas: function() {
            return canvas;
        },

        getSize: getCanvasSize,

        getMousePosition: function() {
            return lastMousePosition;
        },

        isFullScreen: function() {
            return fullscreenCheckbox && fullscreenCheckbox.checked;
        },

        isMouseDown: function() {
            return isMouseDown;
        },

        setIndicatorText: function(id, text) {
            const fullId = id + "-indicator-id";
            const indicator = document.getElementById(fullId);
            if (!indicator) {
                console.error("Cannot find indicator '" + fullId + "'.");
                return;
            }

            indicator.innerText = id + ": " + text;
        },

        setIndicatorsVisibility: function(visible) {
            const indicators = document.getElementById("indicators");
            indicators.style.display = visible ? "block" : "none";
        },

        setMaxSize: function(newMaxWidth, newMaxHeight) {
            maxWidth = newMaxWidth;
            maxHeight = newMaxHeight;

            updateCanvasSize();
        },

        setResizable: function(resizable) {
            buttonsColumn.style.display = resizable ? "block" : "none";
        },

        showLoader: function(show) {
            if (loader) {
                loader.style.display = (show) ? "block": "";
            }
        },

        toggleFullscreen: function(fullscreen) {
            if (fullscreenCheckbox) {
                const needToUpdate = fullscreen != fullscreenCheckbox.checked;
                if (needToUpdate) {
                    fullscreenCheckbox.checked = fullscreen;
                    fullscreenCheckbox.onchange();
                }
            }
        },
    });
})();

const Tabs = (function() {
    function getTabsByGroup(group) {
        const selector = "div.tabs[id=" + group + "-id]";
        const elt = document.querySelector(selector);
        if (!elt) {
            console.error("Cannot find tabs '" + selector + "'.");
        }
        return elt;
    }

    function getSelectedValues(tabsElt) {
        const values = [];

        tabsElt.querySelectorAll("input").forEach(function(input) {
            if (input.checked) {
                values.push(input.value);
            }
        });

        return values;
    }

    return Object.freeze({
        addObserver: function(tabsGroup, observer) {
            const divWrapper = getTabsByGroup(tabsGroup);
            if (divWrapper) {
                divWrapper.querySelectorAll("input").forEach(function(input) {
                    input.addEventListener("change", function(event) {
                        event.stopPropagation();
                        observer(getSelectedValues(divWrapper));
                    }, false);
                });
                return true;
            }

            return false;
        },

        getValues: function(tabsGroup) {
            const divWrapper = getTabsByGroup(tabsGroup);
            if (!divWrapper) {
                return [];
            }

            return getSelectedValues(divWrapper);
        },

        setValues: function(tabsGroup, values) {
            const divWrapper = getTabsByGroup(tabsGroup);
            divWrapper.querySelectorAll("input").forEach(function(input) {
                input.checked = false;
            });

            for (let i = 0; i < values.length; ++i) {
                const id = tabsGroup + "-" + values[i] + "-id";
                divWrapper.querySelector("input[id=" + id + "]").checked = true;
            }
        },
    });
})();

const FileControl = (function() {
    const filenameMaxSize = 16;

    function truncate(name) {
        if (name.length > filenameMaxSize) {
            return name.substring(0, 15) + "..." +
                name.substring(name.length-15);
        }
        return name;
    }

    function getElementBySelector(selector) {
        const elt = document.querySelector(selector);
        if (!elt) {
            console.error("Cannot find input file '" + selector + "'.");
        }
        return elt;
    }

    function getUploadInputById(id) {
        const selector = "input[type=file][id=" + id + "]";
        return getElementBySelector(selector);
    }

    function getDownloadLabel(id) {
        const selector = ".file-control.download > label[id=" + id + "]";
        return getElementBySelector(selector);
    }

    const labelsSelector = ".file-control.upload > label";
    window.addEventListener("load", function() {
        const labels = document.querySelectorAll(labelsSelector);
        labels.forEach(function(label) {
            const input = getUploadInputById(label.htmlFor);
            if (input) {
                const span = label.querySelector("span");
                input.addEventListener("change", function(event) {
                    span.innerText = truncate(input.files[0].name);
                }, false);
            }
        });
    });

    return Object.freeze({
        addDownloadObserver: function(id, observer) {
            const elt = getDownloadLabel(id);
            if (elt) {
                elt.addEventListener("click", function() {
                    event.stopPropagation();
                    observer();
                }, false);
                return true;
            }

            return false;
        },

        addUploadObserver: function(uploadId, observer) {
            const input = getUploadInputById(uploadId);
            if (input) {
                input.addEventListener("change", function() {
                    event.stopPropagation();
                    observer(input.files);
                }, false);
                return true;
            }

            return false;
        },
    });
})();

const Checkbox = (function() {
    function getCheckboxFromId(id) {
        const selector = "input[type=checkbox][id=" + id + "]";
        const elt = document.querySelector(selector);
        if (!elt) {
            console.error("Cannot find checkbox '" + selector + "'.");
        }
        return elt;
    }

    return Object.freeze({
        addObserver: function(checkboxId, observer) {
            const elt = getCheckboxFromId(checkboxId);
            if (elt) {
                elt.addEventListener("change", function(event) {
                    event.stopPropagation();
                    observer(event.target.checked);
                }, false);
                return true;
            }

            return false;
        },

        setChecked: function(checkboxId, value) {
            const elt = getCheckboxFromId(checkboxId);
            if (elt) {
                elt.checked = value ? true : false;
            }
        },

        isChecked: function(checkboxId) {
            const elt = getCheckboxFromId(checkboxId);
            return elt && elt.checked;
        },
    });
})();

const Range = (function() {
    function isRangeElement(elt) {
        return elt.type && elt.type.toLowerCase() === "range";
    }

    function getRangeById(id) {
        const selector = "input[type=range][id=" + id + "]";
        const elt = document.querySelector(selector);
        if (!elt) {
            console.error("Cannot find range '" + selector + "'.");
        }
        return elt;
    }

    function addObserver(rangeId, observer, eventName) {
        const elt = getRangeById(rangeId);
        if (elt) {
            elt.addEventListener(eventName, function(event) {
                event.stopPropagation();
                observer(+elt.value);
            }, false);
            return true;
        }

        return false;
    }

    const thumbSize = 16;
    function updateTooltipPosition(range, tooltip) {
        tooltip.textContent = range.value;

        const bodyRect = document.body.getBoundingClientRect();
        const rangeRect = range.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        const percentage = (range.value - range.min) / (range.max - range.min);

        const top = (rangeRect.top - tooltipRect.height - bodyRect.top) - 4;
        const middle = percentage * (rangeRect.width - thumbSize) +
            (rangeRect.left + 0.5*thumbSize) - bodyRect.left;

        tooltip.style.top = top + "px";
        tooltip.style.left = (middle - 0.5 * tooltipRect.width) + "px";
    }

    window.addEventListener("load", function() {
        const tooltips = document.querySelectorAll(".tooltip");
        tooltips.forEach(function(tooltip) {
            const range = tooltip.previousElementSibling;
            if (isRangeElement(range)) {
                range.parentNode.addEventListener("mouseenter", function() {
                    updateTooltipPosition(range, tooltip);
                }, false);

                range.addEventListener("input", function() {
                    updateTooltipPosition(range, tooltip);
                }, false);
            }
        });
    });

    return Object.freeze({
        addObserver: function(rangeId, observer) {
            return addObserver(rangeId, observer, "input");
        },

        addLazyObserver: function(rangeId, observer) {
            return addObserver(rangeId, observer, "change");
        },

        getValue: function(rangeId) {
            const elt = getRangeById(rangeId);
            if (!elt) {
                return null;
            }
            return +elt.value;
        },

        setValue: function(rangeId, value) {
            const elt = getRangeById(rangeId);
            if (elt) {
                elt.value = value;
            }
        },
    });
})();

Canvas.setMaxSize(768,512);