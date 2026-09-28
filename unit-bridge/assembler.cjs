const { identify } = require('./core.cjs');

// A partial or mixed snapshot must never replace the displayed unit list.
class Assembler {
    constructor() { this.pending = new Map(); this.completed = new Map(); }
    accept(packet, now = Date.now()) {
        if (!packet || packet.protocol !== 'stun-units-v1' || packet.mapVersion !== '2.322'
            || !/^[0-9]+-[0-9]+$/.test(packet.session || '') || packet.session.length > 32
            || !Number.isSafeInteger(packet.snapshot) || packet.snapshot < 1
            || !Number.isInteger(packet.part) || packet.part < 0 || packet.part > 512
            || typeof packet.final !== 'boolean' || !Array.isArray(packet.units) || packet.units.length > 8) {
            throw new Error('유닛 수집 패킷 형식 오류');
        }
        identify(packet);
        for (const [key, value] of this.pending) if (now - value.updated > 15000) this.pending.delete(key);
        if (packet.snapshot <= (this.completed.get(packet.session) || 0)) return null;
        const key = `${packet.session}:${packet.snapshot}`;
        if (!this.pending.has(key)) {
            if (this.pending.size >= 8) this.pending.delete(this.pending.keys().next().value);
            this.pending.set(key, { parts: new Map(), last: null, updated: now });
        }
        const state = this.pending.get(key);
        if (state.last !== null && packet.part > state.last) throw new Error('종료 이후 패킷');
        if (packet.final) {
            if ((state.last !== null && state.last !== packet.part) || [...state.parts.keys()].some(i => i > packet.part)) throw new Error('중복 종료 패킷');
            state.last = packet.part;
        }
        const old = state.parts.get(packet.part);
        if (old && JSON.stringify(old) !== JSON.stringify(packet.units)) throw new Error('동일 순번의 다른 유닛 데이터');
        state.parts.set(packet.part, packet.units); state.updated = now;
        if (state.last === null || state.parts.size !== state.last + 1) return null;
        const units = [];
        for (let i = 0; i <= state.last; i++) { if (!state.parts.has(i)) return null; units.push(...state.parts.get(i)); }
        const result = { mapVersion: '2.322', units };
        identify(result);
        this.completed.set(packet.session, packet.snapshot);
        if (this.completed.size > 16) this.completed.delete(this.completed.keys().next().value);
        this.pending.delete(key);
        return result;
    }
}
module.exports = { Assembler };
