/**
 * Exercises Module Routes
 *
 * - GET    /exercises           - Get paginated list of exercises (with search)
 * - POST   /exercises           - Create a new exercise
 * - GET    /exercises/:id       - Get a single exercise
 * - PUT    /exercises/:id       - Update an exercise
 * - DELETE /exercises           - Bulk delete exercises
 */

import { createRouter } from "@/server/lib/create-app.js";
import { requireAuth } from "@/server/middlewares/index.js";

import * as endpoints from "./endpoints/index.js";
import * as mutations from "./handlers/mutations/index.js";
import * as queries from "./handlers/queries/index.js";

const router = createRouter();

router.use(requireAuth);

router.openapi(endpoints.getPaginatedExercises, queries.getPaginatedExercises);
router.openapi(endpoints.createExercise, mutations.createExercise);
router.openapi(endpoints.getOneExercise, queries.getOneExercise);
router.openapi(endpoints.updateExercise, mutations.updateExercise);
router.openapi(endpoints.bulkDeleteExercise, mutations.bulkDeleteExercise);

export default router;
