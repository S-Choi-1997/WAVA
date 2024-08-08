package com.wava.worcation.domain.channel.service;

import com.wava.worcation.domain.channel.dto.request.MapPinRequestDto;
import com.wava.worcation.domain.channel.dto.response.MapPinResponseDto;

public interface MapPinService {
    MapPinResponseDto createPin(final MapPinRequestDto mapPinRequestDto);
    MapPinResponseDto updatePin(final Long pinId, final MapPinRequestDto mapPinRequestDto);
    void deletePin(final Long pinId);
}
