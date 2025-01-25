
export interface IUpdateable {
    update(delta: number, timePassed: number): void
}

export type GameState = 'start' | 'drained' | 'cleaned' | 'noescape'
