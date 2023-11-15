package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.UCSBDate;
import edu.ucsb.cs156.example.entities.MenuItemReviews;
import edu.ucsb.cs156.example.repositories.MenuItemReviewsRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = MenuItemReviewsController.class)
@Import(TestConfig.class)
public class MenuItemReviewsControllerTests extends ControllerTestCase {

        @MockBean
        MenuItemReviewsRepository menuItemReviewsRepository;

        @MockBean
        UserRepository userRepository;


        // Tests for GET /api/menuitemreview/all
        
        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/menuitemreview/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/menuitemreview/all"))
                                .andExpect(status().is(200)); // logged
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_menuitemreviews() throws Exception {

                // arrange
                LocalDate ldt1 = LocalDate.parse("2022-04-20");

                MenuItemReviews menuItemReview1 = MenuItemReviews.builder()
                                .itemId(27)
                                .reviewerEmail("cgaucho@ucsb.edu")
                                .stars(3)
                                .dateReviewed(ldt1.atStartOfDay())
                                .comments("bland af but edible I guess")
                                .build();

                LocalDate ldt2 = LocalDate.parse("2022-04-20");

                MenuItemReviews menuItemReview2 = MenuItemReviews.builder()
                                .itemId(29)
                                .reviewerEmail("cgaucho@ucsb.edu")
                                .stars(5)
                                .dateReviewed(ldt2.atStartOfDay())
                                .comments("best veggie pizza ever")
                                .build();

                LocalDate ldt3 = LocalDate.parse("2022-04-21");

                MenuItemReviews menuItemReview3 = MenuItemReviews.builder()
                                .itemId(29)
                                .reviewerEmail("ldelplaya@ucsb.edu")
                                .stars(0)
                                .dateReviewed(ldt3.atStartOfDay())
                                .comments("not tryna get food poisoning, but if I were this would do it")
                                .build();


                ArrayList<MenuItemReviews> expectedMenuItemReviews = new ArrayList<>();
                expectedMenuItemReviews.addAll(Arrays.asList(menuItemReview1, menuItemReview2, menuItemReview3));

                when(menuItemReviewsRepository.findAll()).thenReturn(expectedMenuItemReviews);

                // act
                MvcResult response = mockMvc.perform(get("/api/menuitemreview/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(menuItemReviewsRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedMenuItemReviews);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        // Tests for POST /api/menuitemreview/post...

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/menuitemreview/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/menuitemreview/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_menureviewitem() throws Exception {
                // arrange

                LocalDate ldt1 = LocalDate.parse("2022-01-03");

                MenuItemReviews menuItemReview1 = MenuItemReviews.builder()
                                .itemId(29)
                                .reviewerEmail("ldelplaya@ucsb.edu")
                                .stars(2)
                                .dateReviewed(ldt1.atStartOfDay())
                                .comments("eh")
                                .build();

                when(menuItemReviewsRepository.save(eq(menuItemReview1))).thenReturn(menuItemReview1);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/menuitemreview/post?itemId=29&reviewerEmail=ldelplaya@ucsb.edu&stars=2&dateReviewed=2022-01-03T00:00:00&comments=eh")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(menuItemReviewsRepository, times(1)).save(menuItemReview1);
                String expectedJson = mapper.writeValueAsString(menuItemReview1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        // Tests for GET /api/menuitemreview?id=...

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/menuitemreview?id=7"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange
                LocalDate ldt1 = LocalDate.parse("2022-01-03");
                MenuItemReviews menuItemReview1 = MenuItemReviews.builder()
                                .itemId(29)
                                .reviewerEmail("ldelplaya@ucsb.edu")
                                .stars(2)
                                .dateReviewed(ldt1.atStartOfDay())
                                .comments("eh")
                                .build();

                when(menuItemReviewsRepository.findById(eq(7L))).thenReturn(Optional.of(menuItemReview1));

                // act
                MvcResult response = mockMvc.perform(get("/api/menuitemreview?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(menuItemReviewsRepository, times(1)).findById(eq(7L));
                String expectedJson = mapper.writeValueAsString(menuItemReview1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(menuItemReviewsRepository.findById(eq(7L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/menuitemreview?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(menuItemReviewsRepository, times(1)).findById(eq(7L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("MenuItemReviews with id 7 not found", json.get("message"));
        }

        // Tests for PUT /api/menuitemreview?id=... 

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_menureviewitem() throws Exception {
                // arrange

                LocalDate ldt1 = LocalDate.parse("2022-04-20");
                MenuItemReviews menuItemReviewOrig = MenuItemReviews.builder()
                                .itemId(27)
                                .reviewerEmail("cgaucho@ucsb.edu")
                                .stars(3)
                                .dateReviewed(ldt1.atStartOfDay())
                                .comments("bland af but edible I guess")
                                .build();

                LocalDate ldt2 = LocalDate.parse("2022-03-20");
                MenuItemReviews menuItemReviewEdited = MenuItemReviews.builder()
                                .itemId(29)
                                .reviewerEmail("foodlovinggaucho@ucsb.edu")
                                .stars(5)
                                .dateReviewed(ldt2.atStartOfDay())
                                .comments("best veggie pizza ever")
                                .build();

                String requestBody = mapper.writeValueAsString(menuItemReviewEdited);

                when(menuItemReviewsRepository.findById(eq(67L))).thenReturn(Optional.of(menuItemReviewOrig));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/menuitemreview?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(menuItemReviewsRepository, times(1)).findById(67L);
                verify(menuItemReviewsRepository, times(1)).save(menuItemReviewEdited); // should be saved with correct user
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }
        
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_menureviewitem_that_does_not_exist() throws Exception {
                // arrange

                LocalDate ldt2 = LocalDate.parse("2021-04-20");
                
                MenuItemReviews menuItemReviewEdited = MenuItemReviews.builder()
                                .itemId(29)
                                .reviewerEmail("bestgaucho@ucsb.edu")
                                .stars(5)
                                .dateReviewed(ldt2.atStartOfDay())
                                .comments("best veggie pizza ever")
                                .build();

                String requestBody = mapper.writeValueAsString(menuItemReviewEdited);

                when(menuItemReviewsRepository.findById(eq(67L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/menuitemreview?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(menuItemReviewsRepository, times(1)).findById(67L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("MenuItemReviews with id 67 not found", json.get("message"));

        }


        // Tests for DELETE /api/menuitemreview?id=... 

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_date() throws Exception {
                // arrange

                LocalDate ldt1 = LocalDate.parse("2022-04-20");

                MenuItemReviews menuItemReview1 = MenuItemReviews.builder()
                                .itemId(29)
                                .reviewerEmail("food@ucsb.edu")
                                .stars(5)
                                .dateReviewed(ldt1.atStartOfDay())
                                .comments("best veggie pizza ever")
                                .build();

                when(menuItemReviewsRepository.findById(eq(15L))).thenReturn(Optional.of(menuItemReview1));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/menuitemreview?id=15")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(menuItemReviewsRepository, times(1)).findById(15L);
                verify(menuItemReviewsRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("MenuItemReviews with id 15 deleted", json.get("message"));
        }
        
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_ucsbdate_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(menuItemReviewsRepository.findById(eq(15L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/menuitemreview?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(menuItemReviewsRepository, times(1)).findById(15L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("MenuItemReviews with id 15 not found", json.get("message"));
        }

}
