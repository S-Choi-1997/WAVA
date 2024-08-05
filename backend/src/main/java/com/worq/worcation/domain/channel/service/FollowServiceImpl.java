package com.worq.worcation.domain.channel.service;

import com.worq.worcation.common.Exception.ResourceNotFoundException;
import com.worq.worcation.domain.channel.domain.Follow;
import com.worq.worcation.domain.channel.dto.info.FollowInfoDto;
import com.worq.worcation.domain.channel.repository.ChannelRepository;
import com.worq.worcation.domain.channel.repository.FollowRepository;
import com.worq.worcation.domain.user.domain.User;
import com.worq.worcation.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class FollowServiceImpl implements FollowService{

    FollowRepository followRepository;
    ChannelRepository channelRepository;
    UserRepository userRepository;

    @Override
    public Map<String, Object> follow(Long channelId, Long userId) {
        Map<String, Object> map = new HashMap<String, Object>();

        Follow follow = Follow.builder()
                .user(userRepository.findById(userId).orElseThrow(ResourceNotFoundException::new))
                .channel(channelRepository.findById(channelId).orElseThrow(ResourceNotFoundException::new))
                .build();
        followRepository.save(follow);

        int followNum = followRepository.findByUser(userRepository.findById(userId).orElseThrow(ResourceNotFoundException::new)).size();
        int followerNum = followRepository.findByChannel(channelRepository.findById(channelId).orElseThrow(ResourceNotFoundException::new)).size();

        map.put("follow", followNum);
        map.put("folllower", followerNum);

        return map;
    }

    @Override
    public List<FollowInfoDto.UserFollowInfoDto> getFollowers(Long channelId) {
        List<FollowInfoDto.UserFollowInfoDto> followerDtos = new ArrayList<>();
        List<Follow> followers = followRepository.findByChannel(channelRepository.findById(channelId).orElseThrow(ResourceNotFoundException::new));
        for (Follow follow : followers) {
            User user = follow.getUser();
            FollowInfoDto.UserFollowInfoDto dto = FollowInfoDto.UserFollowInfoDto.builder()
                    .userId(user.getId())
                    .profile(user.getProfileImg())
                    .nickname(user.getNickName())
                    .build();
            followerDtos.add(dto);
        }
        return followerDtos;
    }

    @Override
    public List<FollowInfoDto.UserFollowInfoDto> getFollowings(Long userId) {
        List<FollowInfoDto.UserFollowInfoDto> followerDtos = new ArrayList<>();
        List<Follow> followers = followRepository.findByUser(userRepository.findById(userId).orElseThrow(ResourceNotFoundException::new));
        for (Follow follow : followers) {
            User user = follow.getUser();
            FollowInfoDto.UserFollowInfoDto dto = FollowInfoDto.UserFollowInfoDto.builder()
                    .userId(user.getId())
                    .profile(user.getProfileImg())
                    .nickname(user.getNickName())
                    .build();
            followerDtos.add(dto);
        }
        return followerDtos;
    }
}
