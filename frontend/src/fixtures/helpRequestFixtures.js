const helpRequestFixtures = {
    oneHelpRequest: {
        "id": 1,
        "requestEmail": "cgaucho@ucsb.edu",
        "teamID": "f23-7pm-3",
        "tableOrBreakoutRoom": "11",
        "localDateTime": "2022-02-02T12:13:00",
        "explanatation": "Need support running Dokku",
        "solved": "false",
    },
    threeHelpRequests: [
        {
            "id": 1,
            "requestEmail": "cgaucho@ucsb.edu",
            "teamID": "f23-7pm-3",
            "tableOrBreakoutRoom": "11",
            "localDateTime": "2022-02-02T12:13:00",
            "explanatation": "Need support running Dokku",
            "solved": "false",
        },
        {
            "id": 2,
            "requestEmail": "cgaucho1@ucsb.edu",
            "teamID": "f23-7pm-4",
            "tableOrBreakoutRoom": "12",
            "localDateTime": "2022-02-02T12:14:00",
            "explanatation": "Need support running swagger",
            "solved": "false",
        },
        {
            "id": 3,
            "requestEmail": "cgaucho2@ucsb.edu",
            "teamID": "f23-7pm-5",
            "tableOrBreakoutRoom": "13",
            "localDateTime": "2022-02-02T12:15:00",
            "explanatation": "Need support setting up nvm",
            "solved": "false",
        }
    ]
};

export { helpRequestFixtures };