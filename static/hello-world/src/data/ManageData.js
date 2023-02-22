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