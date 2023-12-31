import React from 'react';
import MenuItemReviewTable from "main/components/MenuItemReview/MenuItemReviewTable";
import { menuItemReviewFixtures } from 'fixtures/menuItemReviewFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/MenuItemReviews/MenuItemReviewTable',
    component: MenuItemReviewTable
};

const Template = (args) => {
    return (
        <MenuItemReviewTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    menuitemreviews: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    menuitemreviews: menuItemReviewFixtures.threeMenuItemReviews,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    menuitemreviews: menuItemReviewFixtures.threeMenuItemReviews,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/menuitemreview', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};

