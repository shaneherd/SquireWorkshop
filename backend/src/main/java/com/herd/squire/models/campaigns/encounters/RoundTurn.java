package com.herd.squire.models.campaigns.encounters;

public class RoundTurn {
    private int round;
    private int turn;

    public RoundTurn() {}

    public RoundTurn(int round, int turn) {
        this.round = round;
        this.turn = turn;
    }

    public int getRound() {
        return round;
    }

    public void setRound(int round) {
        this.round = round;
    }

    public int getTurn() {
        return turn;
    }

    public void setTurn(int turn) {
        this.turn = turn;
    }
}
