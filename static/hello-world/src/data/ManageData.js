import { invoke, requestJira } from "@forge/bridge"
import * as Constants from '../utility/Constants';

const fetchDataWithJQL = async (params) => {
    const response = await requestJira(`/rest/api/2/search?jql=${params}`);
    return await response.json();
};

export const issueData = async (projects, linkType, sprints, versions, teams) => {
    let params = `project in (${projects})`;
    
    // checking sprint
    if (sprints && sprints.length > 0) {
        // const sprintIDs = sprints.map((e) => e.id);
        params = params.concat(
            ` AND sprint in (${sprints.join(',')})`
        );
    }
    // checking project's version
    if (versions && versions.length > 0) {
        params = params.concat(
            ` AND fixVersion in (${versions.join(',')})`
        );
    }
    // checking teams
    if (teams && teams.length > 0) {
        params = params.concat(
            ` AND team in (${teams.join(',')})`
        );
    }

    const result = await fetchDataWithJQL(params);
    if (result.errorMessages) {
        return {
            error: result.errorMessages
        };
    }
    let issues = [];
    await Promise.all(result.issues.map(async (element) => {
        let item = {
            key: element.key,
            parentId: getParentIssueByLinkType(element, linkType),
            summary: element.fields.summary,
            title: element.fields.summary,
            startdate: new Date(element.fields[Constants.START_DATE]), // depend on customfield was definded
            duedate: new Date(element.fields.duedate),
            color: getColorByIssueType(element),
            progress: 0
        }
        issues.push(item)
    }))
    return issues;
}

const getParentIssueByLinkType = (element, linkType) => {
    let result = element.fields.issuelinks.filter(link => {
        return link.inwardIssue && link.type.inward === linkType.inward
    });
    return result.length > 0 ? result[0].inwardIssue.key : "0";
}

const getColorByIssueType = (element) => {
    let result = '';
    switch (element.fields.issuetype.id) {
        case Constants.ISSUE_TYPE_EPIC_ID:
            result = 'orange'
            break;
        case Constants.ISSUE_TYPE_STORY_ID:
            result = 'green'
            break;
        case Constants.ISSUE_TYPE_TASK_ID:
            result = 'blue'
            break;
        default:
            break;
    }
    return result;
}

export const getAllProject = async () => {
    const response = await requestJira(`/rest/api/2/project/search`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
    let result = await response.json();
    return result.values;
};

export const getIssueLinkType = async () => {
    const response = await requestJira(`/rest/api/2/issueLinkType`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
    let result = await response.json();
    return result.issueLinkTypes;
};

export const getBoardSprints = async (boardID) => {
    const response = await requestJira(`/rest/agile/1.0/board/${boardID}/sprint`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
    let result = await response.json();
    return result.values.filter(sprint => sprint.state === "active");
}

export const getSprints = async () => {
    const response = await requestJira(`/rest/agile/1.0/board`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
    let data = await response.json();
    let boards =  data.values.filter(board => board.type !== "kanban"); // need to remove kanban board due to not support sprint
    
    const result = await Promise.all(
        boards.map(async (e) => {
            return await getBoardSprints(e.id);
        })
    )
    return Array.from(new Set(result.flat().map(a => a.id)))
        .map(id => {
            return result.flat().find(a => a.id === id)
        }) // result.flat() return list item but not unique. solution to remove duplicate
}

export const getProjectVersions = async (projectIdOrKey) => {
    const response = await requestJira(`/rest/api/2/project/${projectIdOrKey}/versions`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
    let result = await response.json();
    return result;
}

export const getTeams = async (title) => {
    const rs = await invoke("getTeams", { title: title });
    return rs.teams;
};

export const dependencies = [
    // {
    //     'id': 0,
    //     'predecessorId': 'TS-5',
    //     'successorId': 'TS-8',
    //     'type': 0
    // },{
    //     'id': 1,
    //     'predecessorId': 'TS-8',
    //     'successorId': 'TS-9',
    //     'type': 0
    // },{
    //     'id': 2,
    //     'predecessorId': 'TS-1',
    //     'successorId': 'TS-6',
    //     'type': 0
    // }, {
    //     'id': 3,
    //     'predecessorId': 'TS-6',
    //     'successorId': 'TS-7',
    //     'type': 0
    // }, {
    //     'id': 4,
    //     'predecessorId': 'TS-7',
    //     'successorId': 'TS-2',
    //     'type': 0
    // }, {
    //     'id': 5,
    //     'predecessorId': 'TS-2',
    //     'successorId': 'TS-4',
    //     'type': 0
    // }, {
    //     'id': 6,
    //     'predecessorId': 'TS-4',
    //     'successorId': 'TS-3',
    //     'type': 0
    // }
];

export const resources = [
    // {
    //     'id': 1,
    //     'text': 'Management'
    // }, {
    //     'id': 2,
    //     'text': 'Project Manager'
    // }, {
    //     'id': 3,
    //     'text': 'Analyst'
    // }
];

export const resourceAssignments = [
    // {
    //     'id': 0,
    //     'taskId': 1,
    //     'resourceId': 1
    // }, {
    //     'id': 1,
    //     'taskId': 2,
    //     'resourceId': 2
    // }, {
    //     'id': 2,
    //     'taskId': 3,
    //     'resourceId': 3
    // }
];
