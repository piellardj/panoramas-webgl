
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
        function clientToRelative(clientX, clientY) {
            const rect = canvas.getBoundingClientRect();
            return [
                (clientX - rect.left) / rect.width,
                (clientY - rect.top) / rect.height,
            ];
        }

        function mouseDown(clientX, clientY) {
            const pos = clientToRelative(clientX, clientY);

            lastMousePosition[0] = pos[0];
            lastMousePosition[1] = pos[1];

            isMouseDown = true;
            callObservers(mouseDownObservers);
        }

        function mouseUp() {
            if (isMouseDown) {
                isMouseDown = false;
                callObservers(mouseUpObservers);
            }
        }

        function mouseMove(clientX, clientY) {
            const newPos = clientToRelative(clientX, clientY);

            const dX = newPos[0] - lastMousePosition[0];
            const dY = newPos[1] - lastMousePosition[1];

            lastMousePosition[0] = newPos[0];
            lastMousePosition[1] = newPos[1];

            if (isMouseDown) {
                callObservers(mouseDragObservers, dX, dY);
            }

            callObservers(mouseMoveObservers, newPos[0], newPos[1]);
        }

        canvas.addEventListener("mousedown", function(event) {
            if (event.button === 0) {
                mouseDown(event.clientX, event.clientY);
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
            mouseMove(event.clientX, event.clientY);
        });

        window.addEventListener("mouseup", function(event) {
            if (event.button === 0) {
                mouseUp();
            }
        });

        const currentTouches = [];
        let currentDistance = 0; // for pinching management

        canvas.addEventListener("touchstart", function(event) {
            const previousLength = currentTouches.length;

            const touches = event.changedTouches;
            for (let i = 0; i < touches.length; ++i) {
                const touch = touches[i];
                let alreadyRegistered = false;
                for (let iC = 0; iC < currentTouches.length; ++iC) {
                    if (touch.identifier === currentTouches[iC].id) {
                        alreadyRegistered = true;
                        break;
                    }
                }

                if (!alreadyRegistered) {
                    currentTouches.push({
                        id: touch.identifier,
                        clientX: touch.clientX,
                        clientY: touch.clientY,
                    });
                }
            }

            if (previousLength === 0 && currentTouches.length > 0) {
                const currentTouch = currentTouches[0];
                mouseDown(currentTouch.clientX, currentTouch.clientY);
            } else if (currentTouches.length === 2) {
                const mainTouch = currentTouches[0];
                const secondTouch = currentTouches[1];
                const dX = mainTouch.clientX - secondTouch.clientX;
                const dY = mainTouch.clientY - secondTouch.clientY;
                currentDistance = Math.sqrt(dX * dX + dY * dY);
            }
        }, false);

        window.addEventListener("touchend", function(event) {
            const touches = event.changedTouches;
            for (let i = 0; i < touches.length; ++i) {
                const touch = touches[i];
                for (let iC = 0; iC < currentTouches.length; ++iC) {
                    if (touch.identifier === currentTouches[iC].id) {
                        currentTouches.splice(iC, 1);
                        iC--;
                    }
                }
            }

            if (currentTouches.length === 1) {
                const newPos = clientToRelative(currentTouches[0].clientX,
                    currentTouches[0].clientY);
                lastMousePosition[0] = newPos[0];
                lastMousePosition[1] = newPos[1];
            } else if (currentTouches.length === 0) {
                mouseUp();
            }
        });

        window.addEventListener("touchmove", function(event) {
            const touches = event.changedTouches;
            for (let i = 0; i < touches.length; ++i) {
                const touch = touches[i];
                for (let iC = 0; iC < currentTouches.length; ++iC) {
                    if (touch.identifier === currentTouches[iC].id) {
                        currentTouches[iC].clientX = touch.clientX;
                        currentTouches[iC].clientY = touch.clientY;
                    }
                }
            }

            if (isMouseDown) {
                event.preventDefault();
            }

            if (currentTouches.length === 1) {
                mouseMove(currentTouches[0].clientX, currentTouches[0].clientY);
            } else if (currentTouches.length === 2) {
                const mainTouch = currentTouches[0];
                const secondTouch = currentTouches[1];
                const dX = mainTouch.clientX - secondTouch.clientX;
                const dY = mainTouch.clientY - secondTouch.clientY;
                const newDistance = Math.sqrt(dX * dX + dY * dY);

                const dDistance = (currentDistance - newDistance);
                const zoomFactor = dDistance / currentDistance;
                currentDistance = newDistance;

                callObservers(mouseWheelObservers, 5 * zoomFactor);
            }
        }, {passive: false});
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