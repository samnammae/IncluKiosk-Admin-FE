export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  optionCategories: string[];
  isSoldOut: boolean;
}

export interface MenuData {
  success: boolean;
  code: number;
  message: string;
  data: {
    categories: string[];
    menusByCategory: {
      [category: string]: MenuItem[];
    };
  };
}
// export const mockMenuData: MenuData = {
//   success: true,
//   code: 0,
//   message: "메뉴 조회 성공",
//   data: {
//     categories: ["커피", "차", "디저트", "베이커리", "스무디"],
//     menusByCategory: {
//       커피: [
//         {
//           id: "coffee_001",
//           name: "아메리카노",
//           price: 4500,
//           description:
//             "진한 에스프레소와 뜨거운 물로 만든 클래식 커피입니다. 깔끔하고 진한 맛이 특징입니다.",
//           image:
//             "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
//           optionCategories: ["사이즈", "온도", "샷추가"],
//           isSoldOut: false,
//         },
//         {
//           id: "coffee_002",
//           name: "카페라떼",
//           price: 5000,
//           description:
//             "부드러운 스팀 밀크와 에스프레소의 완벽한 조화로 만든 라떼입니다.",
//           image:
//             "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400",
//           optionCategories: ["사이즈", "온도", "시럽"],
//           isSoldOut: false,
//         },
//         {
//           id: "coffee_003",
//           name: "카푸치노",
//           price: 5500,
//           description:
//             "풍성한 우유 거품과 에스프레소가 만나는 이탈리안 스타일 커피입니다.",
//           image: "",
//           optionCategories: ["사이즈", "온도"],
//           isSoldOut: true,
//         },
//         {
//           id: "coffee_004",
//           name: "바닐라 라떼",
//           price: 5500,
//           description:
//             "달콤한 바닐라 시럽이 들어간 부드러운 라떼로 달콤함을 원하는 분께 추천합니다.",
//           image:
//             "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400",
//           optionCategories: ["사이즈", "온도", "시럽농도"],
//           isSoldOut: false,
//         },
//         {
//           id: "coffee_005",
//           name: "카라멜 마키아토",
//           price: 6000,
//           description:
//             "부드러운 스팀 밀크 위에 카라멜 드리즐을 올린 달콤한 커피입니다.",
//           image:
//             "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400",
//           optionCategories: ["사이즈", "온도", "카라멜추가"],
//           isSoldOut: false,
//         },
//       ],
//       차: [
//         {
//           id: "tea_001",
//           name: "얼그레이",
//           price: 4000,
//           description: "베르가못 향이 특징인 영국 전통 홍차입니다.",
//           image: "",
//           optionCategories: ["온도", "당도"],
//           isSoldOut: false,
//         },
//         {
//           id: "tea_002",
//           name: "캐모마일",
//           price: 4500,
//           description: "은은한 꽃향기와 편안한 맛의 허브티입니다.",
//           image:
//             "https://images.unsplash.com/photo-1556881286-fc6915169721?w=400",
//           optionCategories: ["온도", "꿀추가"],
//           isSoldOut: false,
//         },
//       ],
//       디저트: [
//         {
//           id: "dessert_001",
//           name: "티라미수",
//           price: 6500,
//           description:
//             "이탈리아 전통 디저트로 마스카포네 치즈와 에스프레소의 조화가 일품입니다.",
//           image:
//             "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
//           optionCategories: [],
//           isSoldOut: false,
//         },
//         {
//           id: "dessert_002",
//           name: "초콜릿 케이크",
//           price: 5500,
//           description:
//             "진한 초콜릿의 맛과 부드러운 식감이 매력적인 케이크입니다.",
//           image:
//             "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
//           optionCategories: ["사이즈"],
//           isSoldOut: false,
//         },
//       ],
//       베이커리: [
//         {
//           id: "bakery_001",
//           name: "크루아상",
//           price: 3500,
//           description: "바삭하고 부드러운 프랑스 전통 페이스트리입니다.",
//           image: "",
//           optionCategories: ["토핑"],
//           isSoldOut: false,
//         },
//       ],
//       스무디: [
//         {
//           id: "smoothie_001",
//           name: "딸기 바나나 스무디",
//           price: 6000,
//           description: "신선한 딸기와 바나나로 만든 건강한 스무디입니다.",
//           image:
//             "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400",
//           optionCategories: ["사이즈", "당도조절"],
//           isSoldOut: false,
//         },
//       ],
//     },
//   },
// };
export const mockMenuData: MenuData = {
  success: true,
  code: 0,
  message: "메뉴 조회 성공",
  data: {
    categories: ["커피", "차", "디저트", "베이커리", "스무디"],
    menusByCategory: {
      커피: [
        {
          id: "coffee_001",
          name: "아메리카노",
          price: 4500,
          description:
            "진한 에스프레소와 뜨거운 물로 만든 클래식 커피입니다. 깔끔하고 진한 맛이 특징입니다.",
          image:
            "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
          optionCategories: ["사이즈", "온도", "샷추가"],
          isSoldOut: false,
        },
        {
          id: "coffee_002",
          name: "카페라떼",
          price: 5000,
          description:
            "부드러운 스팀 밀크와 에스프레소의 완벽한 조화로 만든 라떼입니다.",
          image:
            "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400",
          optionCategories: ["사이즈", "온도", "시럽"],
          isSoldOut: false,
        },
        {
          id: "coffee_003",
          name: "카푸치노",
          price: 5500,
          description:
            "풍성한 우유 거품과 에스프레소가 만나는 이탈리안 스타일 커피입니다.",
          image: "",
          optionCategories: ["사이즈", "온도"],
          isSoldOut: true,
        },
        {
          id: "coffee_004",
          name: "바닐라 라떼",
          price: 5500,
          description:
            "달콤한 바닐라 시럽이 들어간 부드러운 라떼로 달콤함을 원하는 분께 추천합니다.",
          image:
            "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400",
          optionCategories: ["사이즈", "온도", "시럽농도"],
          isSoldOut: false,
        },
        {
          id: "coffee_005",
          name: "카라멜 마키아토",
          price: 6000,
          description:
            "부드러운 스팀 밀크 위에 카라멜 드리즐을 올린 달콤한 커피입니다.",
          image:
            "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400",
          optionCategories: ["사이즈", "온도", "카라멜추가"],
          isSoldOut: false,
        },
      ],
      차: [
        {
          id: "tea_001",
          name: "얼그레이",
          price: 4000,
          description: "베르가못 향이 특징인 영국 전통 홍차입니다.",
          image: "",
          optionCategories: ["온도", "당도"],
          isSoldOut: false,
        },
        {
          id: "tea_002",
          name: "캐모마일",
          price: 4500,
          description: "은은한 꽃향기와 편안한 맛의 허브티입니다.",
          image:
            "https://images.unsplash.com/photo-1556881286-fc6915169721?w=400",
          optionCategories: ["온도", "꿀추가"],
          isSoldOut: false,
        },
      ],
      디저트: [
        {
          id: "dessert_001",
          name: "티라미수",
          price: 6500,
          description:
            "이탈리아 전통 디저트로 마스카포네 치즈와 에스프레소의 조화가 일품입니다.",
          image:
            "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
          optionCategories: [],
          isSoldOut: false,
        },
        {
          id: "dessert_002",
          name: "초콜릿 케이크",
          price: 5500,
          description:
            "진한 초콜릿의 맛과 부드러운 식감이 매력적인 케이크입니다.",
          image:
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
          optionCategories: ["사이즈"],
          isSoldOut: false,
        },
      ],
      베이커리: [
        {
          id: "bakery_001",
          name: "크루아상",
          price: 3500,
          description: "바삭하고 부드러운 프랑스 전통 페이스트리입니다.",
          image: "",
          optionCategories: ["토핑"],
          isSoldOut: false,
        },
      ],
      스무디: [
        {
          id: "smoothie_001",
          name: "딸기 바나나 스무디",
          price: 6000,
          description: "신선한 딸기와 바나나로 만든 건강한 스무디입니다.",
          image:
            "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400",
          optionCategories: ["사이즈", "당도조절"],
          isSoldOut: false,
        },
      ],
    },
  },
};
