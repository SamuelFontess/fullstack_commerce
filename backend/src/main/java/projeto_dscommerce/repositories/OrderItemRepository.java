package com.comercio.projeto_dscommerce.repositories;

import com.comercio.projeto_dscommerce.entities.OrderItem;
import com.comercio.projeto_dscommerce.entities.OrderItemPK;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, OrderItemPK> {
}
