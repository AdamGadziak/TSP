var motherArr = [],
	c,
	ctx,
	outputDistance,
	tmpDistance,
	startBtn,
	permutationSpan,
	populationSize,
	data,
	crossoverFactor,
	mutationFactor,
	actualBest,
	countSpan,
	maxGenerations,
	recordList,
	counter;
// try with data40 maxgen 10 and 100;

function init() {
	motherArr = [],
	outputDistance = undefined;
	tmpDistance = undefined;
	populationSize = undefined;
	data = undefined;
	crossoverFactor = undefined;
	mutationFactor = undefined;
	actualBest = undefined;
	maxGenerations = undefined;
	counter = 0;
	getFactors();
	generationCount.innerHTML = "";
	records.innerHTML = "";
	startBtn = document.getElementById("start");
	permutationSpan = document.getElementById("permutation");
	countSpan = document.getElementById("generationCount");
	recordList = document.getElementById("records");
	c = document.getElementById("myCanvas");
	ctx  = c.getContext("2d");
	ctx.clearRect(0, 0, c.width, c.height);
	counter = 0;
	data.forEach(function(point, inds) {
		drawPoint(point.x, point.y);
		fillMotherArr(point);
	});
}



function getFactors() {
	var domInputs = ["crossoverFactorId", "mutationFactorId", "maxGenerationsId", "populationSizeId", "dataId"];
	domInputs.forEach(function(input, i) {
		var ref = input.slice(0, -2);
		if (ref === "data") {
			window[ref] = window["data" + document.getElementById(input).value];
		} else {
			window[ref] = +document.getElementById(input).value;
		}
	});
}

function fillMotherArr(point) {
	var tmp = [];
	data.forEach(function(point2) {
		tmp.push(calcDistance(point, point2));
	});
	motherArr.push(tmp);
}

function drawPoint(x, y) {
	ctx.beginPath();
	ctx.arc(x,y,4,0,2*Math.PI);
	ctx.stroke();
}

function drawLine(point1, point2) {
	ctx.moveTo(point1.x, point1.y);
	ctx.lineTo(point2.x,point2.y);
	ctx.stroke();
}

function getDistance(point1Index, point2Index) {
	var point1Array = motherArr[point1Index];
	return point1Array[point2Index];
}

function calcDistance(point1, point2) {
	var a = Math.abs(point1.x - point2.x),
		b = Math.abs(point1.y - point2.y),
		c = Math.floor(Math.sqrt(a*a + b*b));
	return c;
}

function drawPermutation(permutation) {
	ctx.clearRect(0, 0, c.width, c.height);
	data.forEach(function(point) {
		drawPoint(point.x, point.y);
	});
	for(var i = 0; i < permutation.length; i++) {
		if ((i + 1) === permutation.length) {
			drawLine(data[permutation[0]], data[permutation[permutation.length - 1]]);	
			continue;
		}
		drawLine(data[permutation[i]], data[permutation[i+1]]);
	}
}

function shuffle(array) {
    var i = array.length,
        j = 0,
        temp;
    while (i--) {
        j = Math.floor(Math.random() * (i+1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function getPermutationDistance(permutation) {
	tmpDistance = 0;
	for(var i = 0; i < permutation.length; i++) {
		if ((i + 1) === permutation.length) {
			tmpDistance += getDistance(permutation[0], permutation[permutation.length - 1]);
			continue;			
		}
		tmpDistance += getDistance(permutation[i], permutation[i+1]);
	}
	return tmpDistance;
}

function primitiveRandRange(a, b) {
    let x;
    let bClone = b;
    let counter = 10;
    let rangeBoolean = true;
    while (bClone > 10) {
        bClone = bClone / 10;
        counter *= 10;
    }
    // chcek what ragnge python randrange is taking in context and adjust that function
    while (rangeBoolean) {
        x = Math.floor(Math.random() * counter);
        rangeBoolean = (x < a) || (x > b);
    }
    return x;
}

function mutation(perm) {
    var rand1 = primitiveRandRange(0, perm.length - 1),
        rand2 = primitiveRandRange(0, perm.length - 1);
    while (rand1 === rand2) {
        rand2 = primitiveRandRange(0, perm.length - 1);
    }
    var tmp = [],
        maxRand = Math.max(rand1, rand2),
        minRand = Math.min(rand1, rand2);
    for (var i = maxRand; i >= minRand; i--) {
        tmp.push(perm[i]);
    }
    var l = 0;
    for (var j = minRand; j <= maxRand; j++) {
        perm[j] = tmp[l];
        l++;
    }
    return perm;
}
 
function mutation2(perm) {
    var rand1 = primitiveRandRange(0, perm.length - 1),
        rand2 = primitiveRandRange(0, perm.length - 1);
    while (rand1 === rand2) {
        rand2 = primitiveRandRange(0, perm.length - 1);
    }
    var tmp = perm[rand1];
    perm[rand1] = perm[rand2];
    perm[rand2] = tmp;
    return perm;
}

function crossover(perm1, perm2) {
    var rand1 = primitiveRandRange(0, perm1.length - 1),
        rand2 = primitiveRandRange(0, perm1.length - 1);
    while (rand1 === rand2) {
        rand2 = primitiveRandRange(0, perm1.length - 1);
    }
    var newPerm1 = [],
    	newPerm2 = [],
        maxRand = Math.max(rand1, rand2),
        minRand = Math.min(rand1, rand2);
    for (var i = minRand; i <= maxRand; i++) {
    	newPerm2[i] = perm1[i];
    	newPerm1[i] = perm2[i];
    }
    while (newPerm1.length !== perm1.length) {
    	newPerm1.push(undefined);
    	newPerm2.push(undefined);
    }
    for (var k = 0; k <= newPerm1.length - 1; k++) {
    	if (newPerm1[k] === undefined) {
    		for(var j=0; j <= perm1.length - 1; j++) {
    			if (newPerm1.indexOf(perm1[j]) === -1) {
    				newPerm1[k] = perm1[j];
    				break;
    			}
    		}	
    	}
    }
    for (var k = 0; k <= newPerm2.length - 1; k++) {
    	if (newPerm2[k] === undefined) {
    		for(var j=0; j <= perm2.length - 1; j++) {
    			if (newPerm2.indexOf(perm2[j]) === -1) {
    				newPerm2[k] = perm2[j];
    				break;
    			}
    		}	
    	}
    }
    return [newPerm1, newPerm2];
}

function buildFirstGeneration() {
	var perm = [];
	// build first naive permutation
	for (var i = 0; i <= data.length - 1; i++) {
		perm[i] = i;
	}
	var populationPermutations = [],
		populationDistances = [],
		tmpPermutation = [],
		generationMap = new Map(),
		tmpDistance;
	// create as much permutations as we want to population be
	// count rheir distance and push to array of distances from population
	// create map with key as distance and value as index of permutation from population index
	for (var j = 0; j <= populationSize - 1; j++) {
		tmpPermutation = shuffle(perm);
		populationPermutations.push(tmpPermutation.join().split(","));
		tmpDistance = getPermutationDistance(tmpPermutation);
		populationDistances.push(tmpDistance);
		generationMap.set(tmpDistance, j);
	}
	// little hack for that reference? bug array push
	for (var k = 0; k <= populationSize - 1; k++) {
		populationPermutations[k].forEach(function(el, i) { populationPermutations[k][i] = +populationPermutations[k][i]});
	}
	// lets sort those permutations to get the best ones
	sortGeneration(populationDistances, generationMap, populationPermutations);
}

function sortGeneration(distances, distanceIndexMap, generation) {
	// srot array of distances ascending direction
	distances.sort(function(a, b){return a-b});
	var tmp = [],
		index;
	// use sorted distances to sort array of permutations from that generation
	for (var k = 0; k <= populationSize - 1; k++) {
		index = distanceIndexMap.get(distances[k]);
		tmp.push(generation[index]);
	}
	// return to check sorted by distance array of permutations
	checkNewGeneration(tmp);
}

function checkNewGeneration(sortedGeneration) {
	// get distance of the best candidate permutation
	var distCandidate = getPermutationDistance(sortedGeneration[0]);
	// check if our candidate is better than previous
	if (actualBest === undefined || actualBest > distCandidate) {
		actualBest = distCandidate;
		// postMessage("ranklist", counter, actualBest, sortedGeneration[0]);
		var li = document.createElement("li");
		li.innerHTML = "Gen: " + counter + " - " + actualBest;
		recordList.insertBefore(li, recordList.childNodes[0]);
	// draw new record permutation
		drawPermutation(sortedGeneration[0]);
	}
	// lets start with mutations crossovers and selections
	while (counter < maxGenerations - 1) {
		counter++;
		buildNextGeneration(sortedGeneration);
	}
	countSpan.innerHTML = "Amount of all generations:" + (counter + 1);
}

function buildNextGeneration(initGeneration) {
	var newGeneration = initGeneration;
	var crossCandSize = Math.floor((newGeneration.length - 1) * (crossoverFactor / 2)) * 2,
		mutCandSize = Math.floor((crossCandSize * 2) * (mutationFactor / 2)) * 2;
	var arrOfChildren = [],
		tmp;

	// !!!!
	// Crossover
	// !!!!
	// crossover our best scored permutations each other
	// use PMX or OX maybe someday EX
	for (var j = 0; j <= crossCandSize; j += 2) {
		tmp = crossover(newGeneration[j], newGeneration[j+1]);
		arrOfChildren.push(tmp[0]);
		arrOfChildren.push(tmp[1]);
	}
	// !!!!
	// Selection
	// !!!!
	// remove the worst scored permutations and change them with new born children
	for (var i = 0; i <= arrOfChildren.length - 1; i++) {
		newGeneration.pop();
	}
	var index;

	// !!!!
	// Mutation inversion mutation
	// !!!!
	// depends on how many mutation we want to make mutate random new borns
	for (var k = 0; k <= mutCandSize - 1; k++) {
		index = primitiveRandRange(0, arrOfChildren.length - 1);
		arrOfChildren[index] = mutation(arrOfChildren[index]);
	}

	// !!!!
	// Selection
	// !!!!
	arrOfChildren.forEach(function(child) {
		newGeneration.push(child);
	});
	// prepare new generation with their distances to sort and etc.
	var populationDistances = [],
		generationMap = new Map(),
		tmpDistance;
	for (var j = 0; j <= populationSize - 1; j++) {
		tmpDistance = getPermutationDistance(newGeneration[j]);
		populationDistances.push(tmpDistance);
		generationMap.set(tmpDistance, j);
	}
	sortGeneration(populationDistances, generationMap, newGeneration);
}

function start() {
	init();
	buildFirstGeneration();
}
