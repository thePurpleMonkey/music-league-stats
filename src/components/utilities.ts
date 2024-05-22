import { League } from "./league";
import { Member } from "./member";
import { Round } from "./round";

function replacer(key, value) {
    if(value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}

function reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
        return new Map(value.value);
        }
    }
    return value;
}

export function load_league_name(league_id: string) {
    const leaguesString = localStorage.getItem("leagues");
    const leagues = JSON.parse(leaguesString, reviver) as Map<string, string>;
    return leagues.get(league_id);
}

export function save_league_names(leagues: League[]) {
    const result = new Map<string, string>();
    leagues.forEach(league => {
        result.set(league.id, league.name);
    });

    localStorage.setItem("leagues", JSON.stringify(result, replacer));
}

export function load_round_name(round_id: string) {
    const leaguesString = localStorage.getItem("rounds");
    const leagues = JSON.parse(leaguesString, reviver) as Map<string, string>;
    return leagues.get(round_id);
}

export function save_round_names(rounds: Round[]) {
    const result = new Map<string, string>();
    rounds.forEach(round => {
        result.set(round.id, round.name);
    });

    localStorage.setItem("rounds", JSON.stringify(result, replacer));
}

export function load_member_name(member_id: string) {
    const membersString = localStorage.getItem("members");
    const members = JSON.parse(membersString, reviver) as Map<string, string>;
    return members.get(member_id);
}

export function save_member_names(members: Member[]) {
    const result = new Map<string, string>();
    members.forEach(member => {
        result.set(member.id, member.name);
    });

    localStorage.setItem("members", JSON.stringify(result, replacer));
}

export function substitute_URLs(text) {
	const urls = [];
	// var urlRegex = /(https?:\/\/[^\s]+)/g;
	const urlRegex = /(https?:\/\/)?[\w\-~]+(\.[\w\-~]+)+(\/[\w\-~@:%!.]*)*(#[\w-]*)?(\?[^\s]*)?/gi;
	const result = text.replace(urlRegex, function(match) {
		let url = match;
		let suffix = "";
		let prefix = "";
		if (match.endsWith('?') || match.endsWith('!')) {
			suffix = url.substr(url.length - 1, 1); // Get the last character of the url
			url = url.substring(0, url.length - 1); // Trim the last character of the url
		}
		if (!match.startsWith("http")) {
			prefix = "//";
		}
		urls.push(url);
		return '<a href="' + prefix + url + '" target="_blank" rel="noreferrer noopener">' + url + '</a>' + suffix;
	});

	return {html: result, URLs: urls};
}