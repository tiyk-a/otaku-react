exports.getDistinctRel = function(irel) {
    const irelDistinct = [];
    const irelTeamId = [];
    irel.forEach(rel => {
        if (!irelTeamId.includes(rel[2])) {
            irelDistinct.push(rel);
            irelTeamId.push(rel[2]);
        } else {
            irelDistinct.map((e, index) => {
                if (e[2] === rel[2] && e[3] !== 1 && rel[3] === 1) {
                    irelDistinct.splice(index, 1);
                    irelDistinct.push(e);
                }
            })
        }
    })
    return irelDistinct;
}
