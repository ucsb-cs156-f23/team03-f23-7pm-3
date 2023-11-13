const helpRequestFixtures = {
    oneHelpRequest: {
        "id": 1,
        "requestEmail": "cgaucho@ucsb.edu",
        "teamId": "f23-7pm-3",
        "tableOrBreakoutRoom": "11",
        "requestTime": "2022-02-02T12:13:00",
        "explanation": "Need support running Dokku",
        "solved": "false",
    },
    threeHelpRequests: [
        {
            "id": 1,
            "requestEmail": "cgaucho@ucsb.edu",
            "teamId": "f23-7pm-3",
            "tableOrBreakoutRoom": "11",
            "requestTime": "2022-02-02T12:13:00",
            "explanation": "Need support running Dokku",
            "solved": "false",
        },
        {
            "id": 2,
            "requestEmail": "cgaucho1@ucsb.edu",
            "teamId": "f23-7pm-4",
            "tableOrBreakoutRoom": "12",
            "requestTime": "2022-02-02T12:14:00",
            "explanation": "Need support running swagger",
            "solved": "false",
        },
        {
            "id": 3,
            "requestEmail": "cgaucho2@ucsb.edu",
            "teamId": "f23-7pm-5",
            "tableOrBreakoutRoom": "13",
            "requestTime": "2022-02-02T12:15:00",
            "explanation": "Need support setting up nvm",
            "solved": "false",
        }
    ]
};

export { helpRequestFixtures };