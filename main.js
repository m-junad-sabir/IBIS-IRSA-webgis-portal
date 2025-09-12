require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/MapImageLayer",
    "esri/layers/FeatureLayer",
    "esri/layers/GroupLayer",
    "esri/widgets/LayerList",
    "esri/widgets/Home",
    "esri/widgets/Legend",
    "esri/layers/support/LabelClass",
    "esri/PopupTemplate"
], function (
    Map,
    MapView,
    MapImageLayer,
    FeatureLayer,
    GroupLayer,
    LayerList,
    Home,
    Legend,
    LabelClass,
    PopupTemplate
) {
    // Helper function to create a dynamic popup template
    function createPopupTemplate(layer, fieldInfos) {
        layer.popupTemplate = new PopupTemplate({
            title: layer.title,
            content: [{
                type: "fields",
                fieldInfos: fieldInfos
            }]
        });
    }

    // Define the custom style for action buttons
    const buttonStyle = {
        cursor: "pointer",
        padding: "9px",
        fontSize: "12px",
        textAlign: "center",
        borderRadius: "4px",
        borderWidth: "0px",
        marginRight: "5px"
    };

    // Helper function to create the legend widget
    let legendWidget = null;
    function createLegendWidget(view, layer) {
        if (legendWidget) {
            legendWidget.destroy();
            view.ui.remove(legendWidget);
        }
        
        legendWidget = new Legend({
            view: view,
            layerInfos: [{
                layer: layer,
                title: layer.title
            }]
        });
        view.ui.add(legendWidget, "bottom-right");
    }

    // Label class for "Labels" action
    const labelClass = new LabelClass({
        symbol: {
            type: "text", // autocasts as new TextSymbol()
            color: "black",
            haloColor: "white",
            haloSize: 1.5,
            font: {
                family: "Noto Sans",
                size: 10,
            },
        },
        labelPlacement: "above-center",
        labelExpressionInfo: {
            expression: "$feature.Name || $feature.Zone || $feature.Circle",
        },
    });

    // Helper function to toggle labels
    function setLabels(layer) {
        layer.labelsVisible = !layer.labelsVisible;
    }

    // Helper function to create and append the Calcite slider
    function createOpacitySlider(item) {
        const label = document.createElement("calcite-label");
        label.innerText = "Opacity";
        label.scale = "s";
        

        const slider = document.createElement("calcite-slider");
        slider.labelHandles = true;
        slider.labelTicks = true;
        slider.min = 0;
        slider.minLabel = "0";
        slider.max = 1;
        slider.maxLabel = "1";
        slider.scale = "s";
        slider.step = 0.01;
        slider.value = item.layer.opacity;

        slider.addEventListener("calciteSliderChange", () => {
            item.layer.opacity = slider.value;
        });

        label.appendChild(slider);
        return label;
    }

    // A function that executes each time a ListItem is created for a layer.
    function setLayerListActions(event) {
        const item = event.item;
        const layer = item.layer;

        // Custom panel to hold the buttons
        const panelContent = document.createElement("div");
        panelContent.classList.add("btn-group");

        // "Full Extent" button
        const fullExtentBtn = document.createElement("button");
        fullExtentBtn.innerText = "Locate";
        fullExtentBtn.onclick = () => {
            view.goTo(layer.fullExtent).catch((error) => {
                if (error.name !== "AbortError") {
                    console.error(error);
                }
            });
        };
        panelContent.appendChild(fullExtentBtn);

        // "Labels" button
        const labelsBtn = document.createElement("button");
        labelsBtn.innerText = "Labels";
        labelsBtn.onclick = () => {
            setLabels(layer);
        };
        panelContent.appendChild(labelsBtn);
        
        // "Legend" button
        const legendBtn = document.createElement("button");
        legendBtn.innerText = "Legend";
        legendBtn.onclick = () => {
            createLegendWidget(view, layer);
        };
        panelContent.appendChild(legendBtn);

        // Opacity slider panel
        const opacitySlider = createOpacitySlider(item);
        panelContent.appendChild(opacitySlider);

        item.panel = {
            content: panelContent,
            icon: "ellipsis-circle",
            title: "Layer Actions"
        };
    }


    // ~~~~~~~~~ DEFINE LAYERS ~~~~~~~~~~~~~~
    const ChashmaBarrageGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/0",
        title: "Chashma Barrage",
        visible: true,
        layers: [
                new FeatureLayer({
                    url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/1",
                    title: "CJ Link Gauges",
                    visible: true,
                    outFields: ["*"]
                }),
                new FeatureLayer({
                    url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/2",
                    title: "Chashma Gauges",
                    visible: true,
                    outFields: ["*"]
                }),
                new FeatureLayer({
                    url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/3",
                    title: "Chasma",
                    visible: true,
                    outFields: ["*"]
                })
             ]
    });
    ////////////////////////////////////////////////////////////////
    const TaunsaBarrageGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/4",
        title: "Taunsa Barrage",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/5",
                title: "Taunsa Gates",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/6",
                title: "Tunsa",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const GudduBarrageGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/7",
        title: "Guddu Barrage",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/9",
                title: "Guddu Barrage Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/10",
                title: "Guddu",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const MarallaBarrageGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/11",
        title: "Maralla Barrage",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/12",
                title: "Maralla Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/13",
                title: "Marala",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const GorangBarrageGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/14",
        title: "Garang (Kirthar) Canal Barrage",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/15",
                title: "Garang Head Regulator",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/16",
                title: "Garang",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const PatFeederCanalGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/17",
        title: "Pat Feeder Canal",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/18",
                title: "Pat Feeder RD 109+000",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/19",
                title: "Pat Feeder",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const BigGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/84",
        title: "Boundary Layers",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/85",
                title: "Irrigation Network",
                visible: false,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/86",
                title: "Line of Control (LOC)",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/87",
                title: "Major Cities",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/88",
                title: "River Network",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/89",
                title: "Provincial Boundary",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const KotriBarrageGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/20",
        title: "Kotri Barrage",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/21",
                title: "Kotri Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/22",
                title: "Kotri",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const SukkurBarrageGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/23",
        title: "Sukkur Barrage",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/24",
                title: "Sukkur Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/25",
                title: "Sukkur",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const PanjnadBarrageGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/26",
        title: "Panjnad Barrage",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/27",
                title: "Panjnad Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/28",
                title: "Panjnad",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const IslamHeadworksGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/29",
        title: "Islam Headworks",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/30",
                title: "Islam Headworks Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/31",
                title: "Islam Headworks",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const SulemankiHeadworksGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/32",
        title: "Sulemanki Headworks",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/33",
                title: "Sulemanki Headworks Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/34",
                title: "Suleimanki Headworks",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const BallokiHeadworksGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/35",
        title: "Balloki Headworks",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/36",
                title: "Balloki Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/37",
                title: "Balloki",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const SidhnaiBarrageGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/38",
        title: "Sidhnai Barrage",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/39",
                title: "Sidhnai Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/40",
                title: "Sidhnai",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const TrimmuHeadworksGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/41",
        title: "Trimmu Headworks",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/42",
                title: "Trimmu Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/43",
                title: "Trimmu",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const KhankiHeadworksGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/44",
        title: "Khanki Headworks",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/45",
                title: "Khanki Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/46",
                title: "Khanki",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const QadirabadBarrageGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/47",
        title: "Qadirabad Barrage",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/48",
                title: "Qadirabad Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/49",
                title: "Qadirabad",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const RasulBarrageGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/50",
        title: "Rasul Barrage",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/51",
                title: "DS Jalalpur Canal",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/52",
                title: "Rasul Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/53",
                title: "Bund",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/54",
                title: "Jalalpur Canal",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/55",
                title: "Rasul",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const ManglaDamGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/56",
        title: "Mangla Dam",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/57",
                title: "Mangla Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/58",
                title: "Mangla",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const GhaziBarrageGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/59",
        title: "Ghazi Barrage - Tarbela Dam",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/60",
                title: "DS Gauge at Pehur Canal",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/61",
                title: "Ghazi Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/62",
                title: "Gate at Pehur Canal",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/63",
                title: "Tarbela- Ghazi",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const JinnahBarrageGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/64",
        title: "Jinnah Barrage",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/65",
                title: "Jinnah Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/66",
                title: "Jinnah",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const UchCanalGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/67",
        title: "Uch Canal",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/68",
                title: "Uch Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/69",
                title: "Uch",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const ManuthyCanalGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/70",
        title: "Manuthy Canal",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/71",
                title: "Manuthy Canal Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/72",
                title: "Manuthy",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const ThalRegulatoratCJ_LinkCanal = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/73",
        title: "Thal Regulator at CJ-Link Canal",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/74",
                title: "Thal Regulator Gauge RD 36+000",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/75",
                title: "Thal Regulator",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const KachhiCanalGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/76",
        title: "Kachhi Canal",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/77",
                title: "Kachhi Canal RD 1005+000",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const ChachranBridgeGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/78",
        title: "Chachran Bridge",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/79",
                title: "Chachran Site Gauges",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/80",
                title: "Chachran",
                visible: true,
                outFields: ["*"]
            })
        ]
    });
    ////////////////////////////////////////////////////////////////
    const KabulatNowsheraGroup = new GroupLayer({

        url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/81",
        title: "Kabul at Nowshera",
        visible: true,
        layers: [
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/82",
                title: "Kabul At Nowshera Gauge",
                visible: true,
                outFields: ["*"]
            }),
            new FeatureLayer({
                url: "https://113.197.48.2:6443/arcgis/rest/services/Bak/Layers/MapServer/83",
                title: "Kabul - Nowshera",
                visible: true,
                outFields: ["*"]
            })
        ]
    });


    // ~~~~~~~~~~~ DEFINE POP-UP TEMPLATES ~~~~~~~~~~~~~~~~
    createPopupTemplate(ChashmaBarrageGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(ChashmaBarrageGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(ChashmaBarrageGroup.layers.getItemAt(2), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(TaunsaBarrageGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(TaunsaBarrageGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(GudduBarrageGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(GudduBarrageGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(MarallaBarrageGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(MarallaBarrageGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(GorangBarrageGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(GorangBarrageGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(PatFeederCanalGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(PatFeederCanalGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(BigGroup.layers.getItemAt(0), [
        { fieldName: "CanalCode", label: "CanalCode" },
        { fieldName: "River", label: "River" },
        { fieldName: "CNLName", label: "CNLName" },
        { fieldName: "CCAName", label: "CCAName" },
        { fieldName: "CCACode", label: "CCACode" },
        { fieldName: "ACZCode", label: "ACZCode" },
        { fieldName: "ACZName", label: "ACZName" },
        { fieldName: "Province", label: "Province" },
        { fieldName: "Basin", label: "Basin" },
        { fieldName: "Doab", label: "Doab" },
        { fieldName: "Type", label: "Type" },
        { fieldName: "W_Type", label: "W_Type" },
        { fieldName: "Type_New", label: "Type_New" }
    ]);
    createPopupTemplate(BigGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Id", label: "Id" },
        { fieldName: "Lenght", label: "Lenght" }
        
    ]);
    createPopupTemplate(BigGroup.layers.getItemAt(2), [
        { fieldName: "name", label: "name" },
        { fieldName: "population", label: "population" },
        { fieldName: "type", label: "type" },
        { fieldName: "Sel", label: "Sel" },
        { fieldName: "osm_id", label: "osm_id" }
    ]);
    createPopupTemplate(BigGroup.layers.getItemAt(3), [
        { fieldName: "RiverName", label: "RiverName" },
        { fieldName: "Remarks", label: "Remarks" },
        { fieldName: "LenghtKM", label: "LenghtKM" }
    ]);
    createPopupTemplate(BigGroup.layers.getItemAt(4), [
        { fieldName: "Name_0", label: "Name" },
        { fieldName: "Name_1", label: "Name" },
        { fieldName: "VARNAME_1", label: "Var Name" },
        { fieldName: "NL_NAME_1", label: "NL Name" },
        { fieldName: "HASC_1", label: "hasc" },
        { fieldName: "CC_1", label: "cc" },
        { fieldName: "ENGTYPE_1", label: "eng name" },
        { fieldName: "REMARKS_1", label: "remarks" },
        { fieldName: "Shape_Area", label: "area" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(KotriBarrageGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(KotriBarrageGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(SukkurBarrageGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(SukkurBarrageGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(PanjnadBarrageGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(PanjnadBarrageGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(IslamHeadworksGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(IslamHeadworksGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(SulemankiHeadworksGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(SulemankiHeadworksGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(BallokiHeadworksGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(BallokiHeadworksGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(SidhnaiBarrageGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(SidhnaiBarrageGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(TrimmuHeadworksGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(TrimmuHeadworksGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(KhankiHeadworksGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(KhankiHeadworksGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(QadirabadBarrageGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(QadirabadBarrageGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(RasulBarrageGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(RasulBarrageGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(RasulBarrageGroup.layers.getItemAt(2), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(RasulBarrageGroup.layers.getItemAt(3), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(RasulBarrageGroup.layers.getItemAt(4), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(ManglaDamGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(ManglaDamGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(GhaziBarrageGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(GhaziBarrageGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(GhaziBarrageGroup.layers.getItemAt(2), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(GhaziBarrageGroup.layers.getItemAt(3), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(JinnahBarrageGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(JinnahBarrageGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(UchCanalGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(UchCanalGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(ManuthyCanalGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(ManuthyCanalGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(KachhiCanalGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(ChachranBridgeGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(ChachranBridgeGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    ////////////////////////////////////////////////////////////////
    createPopupTemplate(KabulatNowsheraGroup.layers.getItemAt(0), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);
    createPopupTemplate(KabulatNowsheraGroup.layers.getItemAt(1), [
        { fieldName: "Name", label: "Name" },
        { fieldName: "Layer", label: "Layer" },
        { fieldName: "Site_Id", label: "Site_Id" },
        { fieldName: "Site", label: "Site" }
    ]);

    // Create a new Map with the defined layers
    const map = new Map({
        basemap: "satellite",
        //// Order of Layers are according to IRSA DataTable PDF document
        layers: [
            BigGroup,
            ThalRegulatoratCJ_LinkCanal,
            ChachranBridgeGroup,
            KachhiCanalGroup,
            ManuthyCanalGroup,
            UchCanalGroup,
            KotriBarrageGroup,
            SukkurBarrageGroup,
            JinnahBarrageGroup,
            KabulatNowsheraGroup,
            GhaziBarrageGroup,
            RasulBarrageGroup,
            ManglaDamGroup,
            PanjnadBarrageGroup,
            TrimmuHeadworksGroup,
            QadirabadBarrageGroup,
            KhankiHeadworksGroup,
            IslamHeadworksGroup,
            SulemankiHeadworksGroup,
            SidhnaiBarrageGroup,
            BallokiHeadworksGroup,
            PatFeederCanalGroup,
            GorangBarrageGroup,
            MarallaBarrageGroup,
            GudduBarrageGroup,
            TaunsaBarrageGroup,
            ChashmaBarrageGroup
            
        ]
    });

    // Create the MapView
    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [68, 30.6],
        zoom: 6
    });

    // Add Home and LayerList widgets
    view.ui.add(new Home({ view: view }), "top-trailing");
    view.ui.move("zoom", "top-trailing");
    
    view.when(() => {
        const layerList = new LayerList({
            view: view,
            position: "top-leading",
            "show-collapse-button": true,
            "show-heading": true,
            "show-filter": true,
            "filter-placeholder": "Filter layers",
            listItemCreatedFunction: setLayerListActions
        });
        view.ui.add(layerList, "top-leading");
    });
});