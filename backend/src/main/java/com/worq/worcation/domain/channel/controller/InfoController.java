package com.worq.worcation.domain.channel.controller;

import com.worq.worcation.common.s3.service.S3ImageUpLoadService;
import com.worq.worcation.domain.channel.dto.FeedRequestDto;
import com.worq.worcation.domain.channel.dto.FeedResponseDto;
import com.worq.worcation.domain.channel.dto.InfoResponseDto;
import com.worq.worcation.domain.channel.service.InfoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/channel/feed")
@RequiredArgsConstructor
@Slf4j
public class InfoController{
    public final InfoService infoService;
    public final S3ImageUpLoadService s3ImageUpLoadService;

    /**
     *
     * @ 작성자   : 최승호
     * @ 작성일   : 20.08.01
     * @ 설명     : 피드 생성 요청
     * @param files
     * @param feedRequestDto
     * @return
     * @throws IOException
     */
    @PostMapping("/create")
    public ResponseEntity<?> createInfo(
            @RequestPart("file") MultipartFile[] files,
            @RequestPart("info")FeedRequestDto feedRequestDto) throws IOException {

        List<String> imgUrls = new ArrayList<>();
        try {
            for(MultipartFile file : files){
                imgUrls.add(s3ImageUpLoadService.uploadImage(file));
            }

            infoService.CreateFeed(feedRequestDto,imgUrls);

            return ResponseEntity.ok().build();
        }catch (Exception e){
            log.error(e.getMessage());
            return ResponseEntity.status(400).body("잘못된 요청입니다.");
        }
    }

    @PostMapping("/{feedId}/comment")
    public ResponseEntity<?> createComment(@PathVariable("feedId") String feedId, @RequestBody Map<String, String> comment) {
        try {
            Long userid = Long.valueOf(comment.get("userid"));
            Long feedid = Long.valueOf(feedId);
            String commentContext = comment.get("Comment");

            Map<String, Object> commentMap = infoService.createComment(userid, feedid, commentContext);

            return ResponseEntity.ok(commentMap);
        }
        catch (Exception e){
            return ResponseEntity.status(400).body("400에러");
        }
    }

    @GetMapping("/{feedId}/detail")
    public ResponseEntity<?> viewFeed(@PathVariable("feedId") Long feedId, @RequestParam Long userid) {
        try {
            FeedResponseDto feedResponseDto = infoService.viewFeed(feedId,userid);
            return ResponseEntity.ok(feedResponseDto);
        }
        catch (Exception e){
            return ResponseEntity.status(500).body("잘못된 요청");
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<InfoResponseDto>> searchFeed(@RequestParam String keyword) {
        return null;
    }

}
