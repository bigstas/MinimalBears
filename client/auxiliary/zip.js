function zip(...lists) {
    // assert that the lists are of the same length; implicitly expect them to have at least length 1
    lengths = lists.map(function len(list) { return list.length })
    all_lengths_equal = lengths.reduce(function eq(cumulative_bool,current_number) {
        return cumulative_bool && (current_number === lengths[0])
    })
    try {
        if (!all_lengths_equal) { throw `zip error: list lengths not all equal` }
    } catch(error) {
        console.error(error)
        return null
    }
  
    // zip the lists
    let out = lists[0].map(function empty_lists(l) { return [] })
    for(let list_index=0; list_index<lists.length; list_index++) {
        for(let term_index=0; term_index<lists[0].length; term_index++) {
            out[term_index].push(lists[list_index][term_index])
        }
    }
    return out
}

export default zip