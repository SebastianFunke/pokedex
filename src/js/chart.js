const config = {
    type: 'radar',
    data: data,
    options: {
        plugins: {
            filler: {
                propagate: false
            },
            'samples-filler-analyser': {
                target: 'chart-analyser'
            }
        },
        interaction: {
            intersect: false
        }
    }
};


const inputs = {
    min: 4,
    max: 7,
    count: 7,
    decimals: 2,
    continuity: 2
};

const generateLabels = () => {
    return Utils.months({ count: inputs.count });
};

const generateData = () => {
    const values = Utils.numbers(inputs);
    inputs.from = values;
    return values;
};

const labels = Utils.months({ count: 8 });
const data = {
    labels: generateLabels(),
    datasets: [{
        label: 'D0',
        data: generateData(),
        borderColor: Utils.CHART_COLORS.red,
        backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red),
    }]
};


let smooth = false;
let propagate = false;

const actions = [{
        name: 'Randomize',
        handler(chart) {
            inputs.from = [];
            chart.data.datasets.forEach(dataset => {
                dataset.data = generateData();
            });
            chart.update();
        }
    },
    {
        name: 'Propagate',
        handler(chart) {
            propagate = !propagate;
            chart.options.plugins.filler.propagate = propagate;
            chart.update();

        }
    },
    {
        name: 'Smooth',
        handler(chart) {
            smooth = !smooth;
            chart.options.elements.line.tension = smooth ? 0.4 : 0;
            chart.update();
        }
    }
];