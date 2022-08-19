/*global $, tizen, tau, Utils*/
/*jshint unused: false*/
/*jslint laxbreak: true*/

var listScroll = 0;

function setStatus(element, checked) {
    if (checked) {
        $(element).prop('src', 'images/check.png');
    } else {
        $(element).prop('src', 'images/delete.png');
    }
}

function disableWifi() {
    $("#wifiMenu").remove();
}

function disableCellular() {
    $("#cellularMenu").remove();
}

function disableSim() {
    $("#simMenu").remove();
}

function peripheralClick() {
    tau.changePage("#peripheralPage");
}

function cpuClick() {
    tau.changePage("#cpuPage");
}

function cellularClick() {
    tau.changePage("#cellularPage");
}

function displayClick() {
    tau.changePage("#displayPage");
}

function simClick() {
    tau.changePage("#simPage");
}

function wifiClick() {
    tau.changePage("#wifiPage");
}

function buildClick() {
    tau.changePage("#buildPage");
}

function storageClick() {
    tau.changePage("#storagePage");
}

function otherClick() {
    tau.changePage("#otherPage");
}

function batteryClick() {
    tau.changePage("#batteryPage");
}

function batChanged(bat) {
    if (!$("#batIsCharging")[0]) {
        return;
    }
    $("#batLevelValue").html(Math.round(bat.level * 100) + " %");
    setStatus('#batIsCharging', bat.isCharging);
    // $("#batIsCharging")[0].checked = bat.isCharging;
}

function cpuChanged(cpu) {
    $("#cpuLoad").html(Math.round(cpu.load * 100) + " %");
}

function loadInfo() {

    try {
        // BATTERY
        tizen.systeminfo.getPropertyValue("BATTERY", batChanged);
        tizen.systeminfo.addPropertyValueChangeListener("BATTERY", batChanged, {
            hightTreshold: 0.1,
            lowThreshold: 1
        });

        var cap = tizen.systeminfo.getCapabilities(), main = document.getElementById("main"), mainContent = $("#mainContent");

        // noinspection JSCheckFunctionSignatures
        main.addEventListener("pagebeforehide", function () {
            listScroll = mainContent.scrollTop();
        });

        // noinspection JSCheckFunctionSignatures
        main.addEventListener("pageshow", function () {
            mainContent.scrollTop(listScroll);
        });

        // CPU
        $("#cpuArch").html(cap.platformCoreCpuArch + " " + cap.platformCoreFpuArch);
        tizen.systeminfo.getPropertyValue("CPU", cpuChanged);
        tizen.systeminfo.addPropertyValueChangeListener("CPU", cpuChanged, {
            hightTreshold: 0.1,
            lowThreshold: 1
        });

        // Peripheral
        setStatus("#perBluetooth", cap.bluetooth);
        setStatus("#perNfc", cap.nfc);
        setStatus("#perWifi", cap.wifi);
        setStatus("#perWifiDirect", cap.wifiDirect);
        setStatus("#perFmRadio", cap.fmRadio);
        setStatus("#perTelephony", cap.telephony);
        setStatus("#perTelephonyMms", cap.telephonyMms);
        setStatus("#perTelephonySms", cap.telephonySms);
        setStatus("#perCamera", cap.camera);
        setStatus("#perCameraFront", cap.cameraFront);
        setStatus("#perCameraFrontFlash", cap.cameraFrontFlash);
        setStatus("#perCameraBack", cap.cameraBack);
        setStatus("#perCameraBackFlash", cap.cameraBackFlash);
        setStatus("#perImageRecog", cap.visionImageRecognition);
        setStatus("#perFaceRecog", cap.visionFaceRecognition);
        setStatus("#perQrGen", cap.visionQrcodeGeneration);
        setStatus("#perQrRecog", cap.visionQrcodeRecognition);

        setStatus("#perLocationCps", cap.location);
        setStatus("#perLocationGps", cap.locationGps);
        setStatus("#perLocationWpf", cap.locationWps);

        setStatus("#perMic", cap.microphone);
        setStatus("#perUsbHost", cap.usbHost);
        setStatus("#perUsbAcc", cap.usbAccessory);

        setStatus("#perRCA", cap.screenOutputRca);
        setStatus("#perHDMI", cap.screenOutputHdmi);
        setStatus("#perAccelorometer", cap.accelerometer);
        setStatus("#perAccelorometerWakeup", cap.accelerometerWakeup);
        setStatus("#perBarometer", cap.barometer);
        setStatus("#perBarometerWakeup", cap.barometerWakeup);
        setStatus("#perGyroscope", cap.gyroscope);
        setStatus("#perGyroscopeWakeup", cap.gyroscopeWakeup);
        setStatus("#perMagnetometer", cap.magnetometer);
        setStatus("#perMagnetometerWakeup", cap.magnetometerWakeup);
        setStatus("#perPhotometer", cap.photometer);
        setStatus("#perPhotometerWakeup", cap.photometerWakeup);
        setStatus("#perProximity", cap.proximity);
        setStatus("#perProximityWakeup", cap.proximityWakeup);
        setStatus("#perTiltmeter", cap.tiltmeter);
        setStatus("#perTiltmeterWakeup", cap.tiltmeterWakeup);

        setStatus("#opengles", cap.opengles);

        $("#openglestextureFormat").html("Texture format: " + cap.openglestextureFormat);
        if (cap.openglesVersion1_1) {
            $("#openglesversion").html("1.1");
        } else {
            if (cap.openglesVersion2_0) {
                $("#openglesversion").html("2.0");
            } else {
                $("#openglesversion").html("Unknown");
            }
        }
        setStatus("#voipsupport", cap.sipVoip);
        setStatus("#speechRec", cap.speechRecognition);
        setStatus("#speechSyn", cap.speechSynthesis);
        setStatus("#dataEnc", cap.dataEncryption);
        setStatus("#graphicsAcc", cap.graphicsAcceleration);
        setStatus("#pushSupport", cap.push);

        $("#buildPlatformName").html(cap.platformName);
        $("#buildPlatformVersion").html(cap.platformVersion);
        $("#buildWebAPIVersion").html(cap.webApiVersion);
        if (!cap.nativeApiVersion) {
            $("#buildNativeAPIVersion").html("None");
        } else {
            $("#buildNativeAPIVersion").html(cap.nativeApiVersion);
        }

        // Display
        tizen.systeminfo.getPropertyValue("DISPLAY", function (disp) {
            $("#resWidth").html(disp.resolutionWidth);
            $("#resHeight").html(disp.resolutionHeight);
            $("#dpiWidth").html(disp.dotsPerInchWidth);
            $("#dpiHeight").html(disp.dotsPerInchHeight);
            $("#physWidth").html(disp.physicalWidth);
            $("#physHeight").html(disp.physicalHeight);
            $("#brightness").html(disp.brightness * 100);
            $("#multiTouchCount").html(cap.multiTouchCount);
            setStatus("#autorotation", cap.autoRotation);
        });

        // Storage
        tizen.systeminfo.getPropertyValue("STORAGE", function (store) {
            var i, list = $("#storagePage ul");
            for (i = 0; i < store.units.length; i++) {
                list.append('<li class="li-has-multiline"><a>Type<span class="li-text-sub ui-li-sub-text">' + store.units[i].type + '</span></a></li>');
                list.append('<li class="li-has-multiline"><a>Capacity<span class="li-text-sub ui-li-sub-text">' + Utils.bytesToSize(store.units[i].capacity + store.units[i].availableCapacity) + '</span></a></li>');
                list.append('<li class="li-has-multiline"><a>Available<span class="li-text-sub ui-li-sub-text">' + Utils.bytesToSize(store.units[i].availableCapacity) + '</span></a></li>');
                if (store.units[i].isRemovable === true) {
                    list.append('<li class="li-has-thumb-right"><a>Removable<img alt="" src="../images/check.png" class="ui-li-thumb-right has-function" /></a></li>');
                } else {
                    list.append('<li class="li-has-thumb-right"><a>Removable<img alt="" src="../images/delete.png" class="ui-li-thumb-right has-function"  /></a></li>');
                }
            }
        });

        // Build
        tizen.systeminfo.getPropertyValue("BUILD", function (build) {
            $("#buildModel").html(build.model);
            $("#buildManufacturer").html(build.manufacturer);
            $("#buildVersion").html(build.buildVersion);
        });

        // Other. Locale
        tizen.systeminfo.getPropertyValue("LOCALE", function (loc) {
            $("#lang").html(loc.language);
            $("#country").html(loc.country);
        });

        // Other. Network
        /*
         * tizen.systeminfo.getPropertyValue("NETWORK", function(net) { alert(net); alert(net.networkType); // $("#currentNet").html(net); });
         */

        // Other. Memory
        /*
         * tizen.systeminfo.getPropertyValue("MEMORY", function(memory) { alert(memory); alert(memory.status);
         *
         * $("#memStatus").html("Normal");
         *
         * });
         */

        try {
            // Wifi
            tizen.systeminfo.getPropertyValue("WIFI_NETWORK", function (wifi) {
                try {
                    $("#wifiStatus").html(wifi.status);
                    $("#wifiSSID").html(wifi.ssid);
                    $("#wifiIP").html(wifi.ipAddress);
                    $("#wifiIPV6").html(wifi.ipv6Address);
                    $("#wifiSignal").html(wifi.signalStrength * 100 + " %");
                    $("#wifiMAC").html(wifi.macAddress);
                } catch (e) {
                    disableWifi();
                }
            }, function () {
                disableWifi();
            });
        } catch (e) {
            disableWifi();
        }

        try {
            // Cellular
            tizen.systeminfo.getPropertyValue("CELLULAR_NETWORK", function (cel) {
                try {
                    $("#celStatus").html(cel.status);
                    $("#celAPN").html(cel.apn);
                    $("#celIP").html(cel.ipAddress);
                    $("#celIPV6").html(cel.ipv6Address);
                    $("#cellMCC").html(cel.mcc);
                    $("#celMNC").html(cel.mnc);
                    $("#celID").html(cel.cellId);
                    $("#celLAC").html(cel.lac);
                    setStatus('#celRoaming', cel.isRoaming);
                    setStatus('#celFlightMode', cel.isFlightMode);
                    //$("#celRoaming")[0].checked = cel.isRoaming;
                    //$("#celFlightMode")[0].checked = cel.isFlightMode;
                } catch (e) {
                    disableCellular();
                }
            }, function () {
                disableCellular();
            });
        } catch (e) {
            disableCellular();
        }

        try {
            // SIM
            tizen.systeminfo.getPropertyValue("SIM", function (sim) {
                try {
                    $("#simState").html(sim.state);
                    $("#simOpName").html(sim.operatorName);
                    $("#simICCID").html(sim.iccid);
                    $("#simMCC").html(sim.mcc);
                    $("#simMNC").html(sim.mnc);
                    $("#simSPN").html(sim.spn);
                } catch (e) {
                    disableSim();
                }
            }, function () {
                disableSim();
            });
        } catch (e) {
            disableSim();
        }
    } catch (ignore) {
        // alert(err);
    }
}

$(window).on("load", function () {
    loadInfo();

    if (!tau.support.shape.circle) {
        $('#main header').remove();
    }

    window.addEventListener('tizenhwkey', function (ev) {
        if (ev.keyName === "back") {
            switch (Utils.getActivePage()) {
                case 'batteryPage':
                case 'cpuPage':
                case 'buildPage':
                case 'otherPage':
                case 'peripheralPage':
                case 'displayPage':
                case 'cellularPage':
                case 'wifiPage':
                case 'simPage':
                case 'storagePage':
                    tau.changePage('#main');
                    break;
                default:
                    tizen.application.getCurrentApplication().exit();
                    break;
            }
        }
    });
});
