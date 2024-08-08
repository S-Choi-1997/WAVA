package com.wava.worcation.domain.channel.domain;

import com.wava.worcation.domain.channel.dto.request.MapPinRequestDto;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity(name = "map_pin")
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MapPin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pin_id")
    private Long id;

    @Column(name="cord_x")
    private Double lat;

    @Column(name="cord_y")
    private Double lng;

    @Column(name="place_name")
    private String placeName;

    @Column(name="place_url")
    private String placeUrl;

    @Column(name="pin_order")
    private Long pinOrder;

    @Column(name="visit_date")
    private LocalDateTime visitDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="channel_id")
    private Channel channel;

    @OneToMany(mappedBy = "mapPin", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Companion> companions;

    public void update(MapPinRequestDto requestDto) {
        this.lat = requestDto.getLat();
        this.lng = requestDto.getLng();
        this.placeName = requestDto.getPlaceName();
        this.placeUrl = requestDto.getPlaceUrl();
        this.pinOrder = requestDto.getPinOrder();
        this.visitDate = requestDto.getVisitDate();
    }
}
