/**
 * sortType // 'date' 'thoughtsCount' 'upvote'
 * sequence // false true
 */

let quickSortBy = (data, sortType, sequence) => {
	let myArray = data,
		isIncrease = sequence || false; // 是否 升序 (从小到大) (从老到新) (默认不是)

	let swap = (array, indexA, indexB) => {
		let temp = array[indexA];
		array[indexA] = array[indexB];
		array[indexB] = temp;
	}
	
	let partition = (array, pivot, left, right) => {
		let storeIndex = left,
			pivotValue = array[pivot][sortType];
	
		swap(array, pivot, right);
	 
		for(let v = left; v < right; v++) {
	
			// 升序 从小到大 日期从古老到现代
			if (isIncrease) {
				if(array[v][sortType] < pivotValue) {
					swap(array, v, storeIndex);
					storeIndex++;
				}
			// 降序 从大到小 日期从现代到古老 (默认)
			} else {
				if(array[v][sortType] > pivotValue) {
					swap(array, v, storeIndex);
					storeIndex++;
				}
			}
		}
	
		swap(array, right, storeIndex);
	
		return storeIndex;
	}
	
	let sort = (array, left, right) => {
		let pivot = null;
	
		if(typeof left !== 'number') {
			left = 0;
		}
	
		if(typeof right !== 'number') {
			right = array.length - 1;
		}
	
		if(left < right) {
			pivot     = left + Math.ceil((right - left) * 0.5);
			let newPivot  = partition(array, pivot, left, right);

			sort(array, left, newPivot - 1);
			sort(array, newPivot + 1, right);
		}
	}

	sort(myArray);

	return myArray;
}

export default quickSortBy
