import { supabase } from "../config/supabase";
import { petsData } from "./petsData";

export const importPetsData = async () => {
  try {
    // First, let's format the data for our external_data table
    const formattedData = [
      ...petsData.dogs.map((dog) => ({
        type: "dog",
        breed: dog.breed,
        size: dog.size,
        temperament: dog.temperament,
        lifespan: dog.lifespan,
        exercise_needs: dog.exercise_needs,
        grooming_needs: dog.grooming_needs,
        good_with_children: dog.good_with_children,
        good_with_others: dog.good_with_other_dogs,
        shedding: dog.shedding,
        trainability: dog.trainability,
        indoor_outdoor: "Both",
      })),
      ...petsData.cats.map((cat) => ({
        type: "cat",
        breed: cat.breed,
        size: cat.size,
        temperament: cat.temperament,
        lifespan: cat.lifespan,
        exercise_needs: cat.exercise_needs,
        grooming_needs: cat.grooming_needs,
        good_with_children: cat.good_with_children,
        good_with_others: cat.good_with_other_cats,
        shedding: cat.shedding,
        trainability: "Moderate",
        indoor_outdoor: cat.indoor_outdoor,
      })),
    ];

    // Insert the data into the external_data table
    const { data, error } = await supabase
      .from("external_data")
      .insert(formattedData)
      .select();

    if (error) {
      throw error;
    }

    console.log("Successfully imported", data.length, "pet breeds");
    return data;
  } catch (error) {
    console.error("Error importing data:", error);
    throw error;
  }
};

// Helper function to check if data already exists
export const checkExistingData = async () => {
  try {
    const { count, error } = await supabase
      .from("external_data")
      .select("*", { count: "exact" });

    if (error) {
      throw error;
    }

    return count;
  } catch (error) {
    console.error("Error checking existing data:", error);
    throw error;
  }
};
