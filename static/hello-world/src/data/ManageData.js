import {requestJira} from "@forge/bridge"
import * as Constants from '../utility/Constants';

const fetchDataWithJQL = async (params) => {
    console.log(params);
    const response = await requestJira(`/rest/api/2/search?jql=${params}`);
    return await response.json();
};

export const issueData = async (projects, linkType, issueKey, dateRange, fixedVersions) => {
    // let listProject = projects.map(element => JSON.stringify(element.key))
    let params = issueKey === "" ? `project in (${projects})` : `project in (${projects}) AND issue =${issueKey}`;
    if (dateRange) {
        params = params.concat(` AND created >=${formatDate(dateRange.start)} AND created <=${formatDate(dateRange.end)}`);
    }
    if (fixedVersions) {
        params = params.concat(` AND fixVersion in ("${fixedVersions.join("\",\"")}")`)
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
    console.log(issues);
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
        case Constants.ISSUE_TYPE_EPIC_ID:
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

export const tasks = [
    {
        'id': 1,
        'parentId': 0,
        'title': 'Software Development',
        'start': new Date('2023-02-21T05:00:00.000Z'),
        'end': new Date('2023-03-04T12:00:00.000Z'),
        'progress': 31
    }, {
        'id': 2,
        'parentId': 1,
        'title': 'Scope',
        'start': new Date('2023-02-21T05:00:00.000Z'),
        'end': new Date('2023-03-04T12:00:00.000Z'),
        'progress': 60
    }, {
        'id': 3,
        'parentId': 2,
        'title': 'Determine project scope',
        'start': new Date('2023-02-21T05:00:00.000Z'),
        'end': new Date('2023-03-04T12:00:00.000Z'),
        'progress': 100
    }, {
        'id': 4,
        'parentId': 0,
        'title': 'Requirement',
        'start': new Date('2023-03-04T12:00:00.000Z'),
        'end': new Date('2023-03-08T12:00:00.000Z'),
        'progress': 31
    }, {
        'id': 5,
        'parentId': 0,
        'title': 'Testing',
        'start': new Date('2023-03-08T12:00:00.000Z'),
        'end': new Date('2023-03-11T12:00:00.000Z'),
        'progress': 31
    }, {
        'id': 6,
        'parentId': 4,
        'title': 'Analyze',
        'start': new Date('2023-03-04T12:00:00.000Z'),
        'end': new Date('2023-03-08T12:00:00.000Z'),
        'progress': 31
    }, {
        'id': 7,
        'parentId': 5,
        'title': 'Regression test',
        'start': new Date('2023-03-08T12:00:00.000Z'),
        'end': new Date('2023-03-11T12:00:00.000Z'),
        'progress': 31
    }
];

export const dependencies = [
    {
        'id': 0,
        'predecessorId': 1,
        'successorId': 2,
        'type': 0
    }, {
        'id': 1,
        'predecessorId': 2,
        'successorId': 3,
        'type': 0
    }, {
        'id': 2,
        'predecessorId': 3,
        'successorId': 4,
        'type': 0
    }
];

export const resources = [
    {
        'id': 1,
        'text': 'Management'
    }, {
        'id': 2,
        'text': 'Project Manager'
    }, {
        'id': 3,
        'text': 'Analyst'
    }
];

export const resourceAssignments = [
    {
        'id': 0,
        'taskId': 1,
        'resourceId': 1
    }, {
        'id': 1,
        'taskId': 2,
        'resourceId': 2
    }, {
        'id': 2,
        'taskId': 3,
        'resourceId': 3
    }
];
