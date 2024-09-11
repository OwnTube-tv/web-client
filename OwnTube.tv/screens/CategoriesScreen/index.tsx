import { useGetCategoriesQuery } from "../../api";
import { Screen } from "../../layouts";
import { CategoryView, Loader } from "../../components";

export const CategoriesScreen = () => {
  const { data: categories, isFetching } = useGetCategoriesQuery();

  return (
    <Screen style={{ padding: 0 }}>
      {isFetching ? <Loader /> : categories?.map((category) => <CategoryView category={category} key={category.id} />)}
    </Screen>
  );
};
