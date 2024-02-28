package com.herd.squire.models.rolls;

import java.util.ArrayList;
import java.util.List;

public class RollResult {
    private List<DiceResult> results;

    public RollResult() {
        results = new ArrayList<>();
    }

    public RollResult(List<DiceResult> results) {
        this.results = results;
    }

    public List<DiceResult> getResults() {
        return results;
    }

    public void setResults(List<DiceResult> results) {
        this.results = results;
    }

    public int getTotalResult() {
        int total = 0;
        for (DiceResult diceResult : getResults()) {
            total += diceResult.getTotalResult();
        }
        return total;
    }

    public void setTotalResult(int totalResult) {}
}
