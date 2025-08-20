package com.comercio.projeto_dscommerce.repositories;

import com.comercio.projeto_dscommerce.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
